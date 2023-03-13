import React, { useMemo } from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import Responsive from "@/components/dev-responsive";
// import NFTBuilderPreview from "../../../../../admin/src/components/nft-builder-preview";
import NftPreview from "@/components/project/nft-preview";
import { createAssociatedTokenAccountInstruction } from "@/utils/transferSplToken/createAssociatedTokenAccountInstruction";
import { createTransferInstruction } from "@/utils/transferSplToken/createTransferInstructions";
import { getAccountInfo } from "@/utils/transferSplToken/getAccountInfo";
import { getAssociatedTokenAddress } from "@/utils/transferSplToken/getAssociatedTokerAddress";
import { getOrCreateAssociatedTokenAccount } from "@/utils/transferSplToken/getOrCreateAssociatedTokenAccount";
import { trpc } from "@/utils/trpc";
import {
    ASSOCIATED_TOKEN_PROGRAM_ID,
    TOKEN_PROGRAM_ID,
} from "@solana/spl-token";
import {
    SignerWalletAdapter,
    WalletNotConnectedError,
} from "@solana/wallet-adapter-base";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import {
    Connection,
    LAMPORTS_PER_SOL,
    PublicKey,
    SystemProgram,
    Transaction,
    clusterApiUrl,
} from "@solana/web3.js";
import Decimal from "decimal.js";
import { toast } from "react-hot-toast";
import { createEcoOrderSchema } from "@ecotoken/api/src/schema/order";
import Button from "@ecotoken/ui/components/Button";
import Form, {
    FormInput,
    FormSelect,
    useZodForm,
} from "@ecotoken/ui/components/Form";

// admin wllet
const adminKey = new PublicKey("HRyCvp4ha6zw6Cepc7kaXkpDfWESiNoEzkYoFS8M5S15");
// usdc address
const mint = new PublicKey("A3HyGZqe451CBesNqieNPfJ4A9Mu332ui8ni6dobVSLB");

const PurchaseProject = () => {
    const router = useRouter();
    const { connection } = useConnection();
    const { id } = router.query;

    const { data: project } = trpc.ecoProjects.get.useQuery(
        {
            identifier: id as string,
            location: true,
            producer: true,
            series: true,
        },
        {
            enabled: !!id,
        },
    );

    const { mutateAsync, isLoading: isOrdering } =
        trpc.ecoOrders.create.useMutation({
            async onSuccess(data) {
                await router.push(`/orders/${data.ecoOrderID}`);
            },
        });

    const { data: price } = trpc.coinPrice.get.useQuery();

    const form = useZodForm({
        schema: createEcoOrderSchema.omit({
            nftSeriesID: true,
            userWallet: true,
            payAmount: true,
            payFee: true,
            payHash: true,
            userID: true,
        }),
        defaultValues: {
            creditsPurchased: new Decimal(0),
        },
    });

    const { publicKey, wallet, sendTransaction, signTransaction } = useWallet();

    const date = useMemo(() => new Date(), []);

    const currency = form.watch("currency");
    let credits;
    try {
        credits = form.watch("creditsPurchased").toNumber();
        console.log(credits);
    } catch (error) {
        credits = form.watch("creditsPurchased") as number;
    }
    const retiredBy = form.watch("retireBy");

    if (!project || !price) return <>Loading...</>;

    if (!project.nftSeries)
        return <div>No NFT series are attached to this project.</div>;
    else
        return (
            <div className="relative mb-8 flex min-h-screen w-full flex-wrap justify-center ">
                <div
                    className="flex h-[280px] w-full items-end px-8  py-10 "
                    style={{
                        backgroundImage: `url(${
                            project.listImage?.startsWith("https")
                                ? project.listImage
                                : `${process.env.NEXT_PUBLIC_CDN_URL}/${project.listImage}`
                        })`,
                    }}
                >
                    <h2 className="font-head text-3xl font-semibold text-white ">
                        {project.title}
                    </h2>
                </div>
                <div className="mt-16 flex w-[1024px] flex-wrap items-start justify-between px-3 lg:flex-row-reverse lg:flex-nowrap">
                    <div className="flex w-full justify-center px-0 py-0 lg:w-[600px]">
                        <NftPreview
                            image={
                                project.nftSeries.seriesImage?.startsWith(
                                    "https",
                                )
                                    ? project.nftSeries.seriesImage
                                    : `${process.env.NEXT_PUBLIC_CDN_URL}/eco-projects/${project.projectID}/nft-series/${project.nftSeries.nftSeriesID}/baseImage.png`
                            }
                            project={project.shortTitle}
                            location={project.location?.location}
                            producer={project.producer.companyName ?? undefined}
                            batch={project.nftSeries.regenBatch}
                            symbol={project.nftSeries?.seriesType}
                            credits={credits}
                            retiredBy={retiredBy}
                            date={date}
                        />
                        {/* <NFTBuilderPreview
                            className="h-[600px] w-[600px]"
                            image={
                                project.nftSeries.seriesImage?.startsWith(
                                    "https",
                                )
                                    ? project.nftSeries.seriesImage
                                    : `${process.env.NEXT_PUBLIC_CDN_URL}/eco-projects/${project.projectID}/nft-series/${project.nftSeries.nftSeriesID}/baseImage.png`
                            }
                            project={project.shortTitle}
                            location={project.location?.location}
                            producer={project.producer.companyName ?? undefined}
                            batch={project.nftSeries.regenBatch}
                            symbol={project.nftSeries?.seriesType}
                            credits={credits.toNumber()}
                            retiredBy={retiredBy}
                            date={date}
                        /> */}
                    </div>

                    <div className="flex w-full justify-center py-5 pr-2 lg:w-[380px]">
                        <div className="flex w-screen max-w-[500px] flex-col  px-4 lg:px-0">
                            <h3 className="text-lg font-bold leading-[1.25] text-slate-700">
                                {project.title}
                            </h3>
                            <h4 className="text-lg text-slate-600">
                                {project.location?.location}
                            </h4>
                            <Form
                                className="space-y-4"
                                form={form}
                                onSubmit={async (data) => {
                                    console.log(data);
                                    // TODO: order
                                    if (
                                        !publicKey ||
                                        !signTransaction ||
                                        !project.nftSeries
                                    )
                                        return;

                                    let buyerAssiciatedToken =
                                        await getAssociatedTokenAddress(
                                            mint,
                                            publicKey,
                                            false,
                                            TOKEN_PROGRAM_ID,
                                            ASSOCIATED_TOKEN_PROGRAM_ID,
                                        );

                                    let adminAssiciatedToken =
                                        await getAssociatedTokenAddress(
                                            mint,
                                            adminKey,
                                            false,
                                            TOKEN_PROGRAM_ID,
                                            ASSOCIATED_TOKEN_PROGRAM_ID,
                                        );

                                    const transaction = new Transaction();
                                    let account;
                                    try {
                                        account = await getAccountInfo(
                                            connection,
                                            buyerAssiciatedToken,
                                            undefined,
                                            TOKEN_PROGRAM_ID,
                                        );
                                    } catch (error: any) {
                                        if (
                                            error.message ===
                                                "TokenAccountNotFoundError" ||
                                            error.message ===
                                                "TokenInvalidAccountOwnerError"
                                        ) {
                                            transaction.add(
                                                createAssociatedTokenAccountInstruction(
                                                    publicKey,
                                                    buyerAssiciatedToken,
                                                    publicKey,
                                                    mint,
                                                    TOKEN_PROGRAM_ID,
                                                    ASSOCIATED_TOKEN_PROGRAM_ID,
                                                ),
                                            );
                                        }
                                    }
                                    try {
                                        account = await getAccountInfo(
                                            connection,
                                            adminAssiciatedToken,
                                            undefined,
                                            TOKEN_PROGRAM_ID,
                                        );
                                    } catch (error: any) {
                                        if (
                                            error.message ===
                                                "TokenAccountNotFoundError" ||
                                            error.message ===
                                                "TokenInvalidAccountOwnerError"
                                        ) {
                                            transaction.add(
                                                createAssociatedTokenAccountInstruction(
                                                    publicKey,
                                                    adminAssiciatedToken,
                                                    adminKey,
                                                    mint,
                                                    TOKEN_PROGRAM_ID,
                                                    ASSOCIATED_TOKEN_PROGRAM_ID,
                                                ),
                                            );
                                        }
                                    }
                                    try {
                                        transaction.add(
                                            createTransferInstruction(
                                                buyerAssiciatedToken, // source
                                                adminAssiciatedToken, // dest
                                                publicKey,
                                                data.creditsPurchased.toNumber() *
                                                    Number(
                                                        project.nftSeries
                                                            .creditPrice,
                                                    ) *
                                                    1e6,
                                                [],
                                                TOKEN_PROGRAM_ID,
                                            ),
                                        );
                                        transaction.feePayer = publicKey;
                                        transaction.recentBlockhash = (
                                            await connection.getLatestBlockhash()
                                        ).blockhash;
                                        const signed = await signTransaction(
                                            transaction,
                                        );

                                        const txId =
                                            await connection.sendRawTransaction(
                                                signed.serialize(),
                                            );
                                        await connection.confirmTransaction(
                                            txId,
                                        );
                                        toast.success(
                                            "Successfully transferred",
                                        );
                                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                    } catch (error) {
                                        toast.error("Transfer SOL failed");
                                        return;
                                    }

                                    await mutateAsync({
                                        ...data,
                                        nftSeriesID:
                                            project.nftSeries?.nftSeriesID ??
                                            "",
                                        userWallet: publicKey?.toBase58(),
                                        payFee: 0,
                                        payAmount: 10,
                                        payHash: "asasas",
                                    });
                                }}
                            >
                                <div className="mt-4 flex items-end justify-start">
                                    <FormInput
                                        className="float-left mt-3 mr-0 w-48"
                                        id="creditamt"
                                        type="number"
                                        label="Amount of Credits to Purchase"
                                        defaultValue={100}
                                        step="any"
                                        {...form.register("creditsPurchased")}
                                    />
                                    <div className="float-left mb-2 inline-block border">
                                        {project.nftSeries.seriesType}
                                    </div>
                                </div>
                                <FormSelect
                                    label="Currency"
                                    className="mt-3 w-48"
                                    {...form.register("currency")}
                                >
                                    {/* {createEcoOrderSchema.shape.currency.options.map(
                                        (type) => (
                                            <option key={type} value={type}>
                                                {type}
                                            </option>
                                        ),
                                    )} */}
                                    <option>USDC</option>
                                </FormSelect>

                                <div className="inline-block w-[100%] py-2">
                                    Purchase Price:{" "}
                                    {Number(
                                        (Number(credits) *
                                            Number(
                                                project.nftSeries.creditPrice,
                                            )) /
                                            (currency === "SOL"
                                                ? // @ts-ignore eslint-disable-next-line
                                                  (price.data.solana
                                                      .usd as number)
                                                : 1),
                                    ).toFixed(2)}
                                </div>
                                {/* <div>
                                    {project.nftSeries?.creditPrice &&
                                        `Purchase Price: $${project.nftSeries?.creditPrice.times(
                                            credits,
                                        )}`}
                                </div> */}
                                <FormInput
                                    size="full"
                                    label="Retired By"
                                    className="mt-3 mb-3"
                                    {...form.register("retireBy")}
                                />
                                <Button
                                    className="mt-8"
                                    fullWidth
                                    loading={isOrdering}
                                >
                                    Purchase Credits
                                </Button>
                            </Form>
                        </div>
                    </div>
                </div>
            </div>
        );
};

export default PurchaseProject;