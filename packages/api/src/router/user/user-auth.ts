import { z } from "zod";
import { publicProcedure, router, userAuthedProcedure } from "../../trpc";
import { unsealData } from "iron-session";
import { TRPCError } from "@trpc/server";
import {
    loginUserSchema,
    type emailVerificationSchema,
} from "../../schema/user";

export const userAuthRouter = router({
    emailVerification: publicProcedure
        .input(
            z.object({
                token: z.string(),
            }),
        )
        .query(async ({ input, ctx }) => {
            const unsealedData = await unsealData<
                z.infer<typeof emailVerificationSchema>
            >(atob(input.token), {
                password: process.env.IRON_SESSION_PASSWORD as string,
                ttl:
                    60 *
                    60 *
                    Number(process.env.EMAIL_VERIFICATION_EXPIRE_TIME),
            });

            if (!unsealedData.email || !unsealedData.userID)
                throw new TRPCError({
                    code: "UNAUTHORIZED",
                    cause: "invalid",
                    message: "Email verification token is invalid.",
                });

            // check if user has already been created and their email already exists in the database
            if (
                await ctx.prisma.user.findUnique({
                    where: {
                        userID: unsealedData.userID,
                    },
                })
            )
                throw new TRPCError({
                    code: "UNAUTHORIZED",
                    cause: "expired",
                    message: "Email verification token has expired.",
                });

            // const usersRouterInterface = usersRouter.createCaller(ctx);
            // await usersRouterInterface.create({
            //     ...unsealedData,
            // });

            return 200;
        }),
    login: publicProcedure
        .input(loginUserSchema)
        .mutation(async ({ ctx, input }) => {
            const user = await ctx.prisma.user.findFirst({
                where: {
                    OR: [
                        {
                            username: input.user,
                        },
                        {
                            email: input.user,
                        },
                    ],
                    AND: {
                        site: {
                            siteID: ctx.currentSite.siteID,
                        },
                    },
                },
            });

            if (!user)
                throw new TRPCError({
                    code: "NOT_FOUND",
                    message: "A user could not be found.",
                });
            // else if (!(await verify(user.password, input.password)))
            //     throw new TRPCError({
            //         code: "UNAUTHORIZED",
            //         message: "Username, email, or password is incorrect.",
            //     });

            const role = await ctx.prisma.role.findFirst({
                where: {
                    OR: [
                        {
                            sites: {
                                some: {
                                    siteID: ctx.selectedSite?.siteID,
                                },
                            },
                            scope: "SITE",
                        },
                        {
                            domain: {
                                equals: "ADMIN",
                            },
                            scope: "DEFAULT",
                        },
                    ],
                },
                include: {
                    permissions: true,
                },
            });
            ctx.session!.user = {
                type: "user",
                id: user.userID,
                permissions: role?.permissions,
                ipAddress:
                    process.env.NODE_ENV === "production"
                        ? (ctx.req.headers["x-real-ip"] as string) ?? ""
                        : undefined,
            };
            await ctx.session!.save();
        }),
    // register: publicProcedure
    //     .input(createUserSchema)
    //     .mutation(async ({ input, ctx }) => {
    //         const sealedData = await sealData(
    //             { ...input },
    //             {
    //                 password: process.env.IRON_SESSION_PASSWORD as string,
    //                 ttl:
    //                     60 *
    //                     60 *
    //                     Number(process.env.EMAIL_VERIFICATION_EXPIRE_TIME),
    //             },
    //         );

    //         if (!!process.env.DISABLE_EMAIL_VERIFICATION) {
    //             const usersRouterInterface = usersRouter.createCaller(ctx);
    //             await usersRouterInterface.create({
    //                 ...input,
    //             });
    //         } else {
    //             await transporter.verify();
    //             await transporter.sendMail({
    //                 from: process.env.EMAIL_VERIFICATION_EMAIL_ADDRESS,
    //                 to: input.email,
    //                 subject: "ecoToken - Verify your email",
    //                 html: `
    //             <h1 style="margin-bottom: 8px;">Verify your email address</h1>
    //             <h3 style="margin-bottom: 16px;">
    //                 To continue setting up your ecoToken account, please verify your
    //                 email address.
    //             </h3>
    //             <a href="${getBaseUrl()}/email-verification/${btoa(
    //                     sealedData,
    //                 )}">Verify email address</a>
    //             `,
    //             });
    //         }
    //     }),
    logout: userAuthedProcedure.query(async ({ ctx }) => {
        ctx.session.destroy();
        return 200;
    }),
});
