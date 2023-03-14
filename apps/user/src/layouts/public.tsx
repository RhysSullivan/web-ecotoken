import type { NextPage } from "next";
import Head from "next/head";
import PublicFooter from "@/components/public/layout/footer";
import PublicNavbar from "@/components/public/layout/navbar";
import { trpc } from "@/utils/trpc";

const DefaultLayout: NextPage<React.PropsWithChildren> = ({ children }) => {
    return (
        <>
            <Head>
                <title>EcoToken</title>
                <meta name="description" content="The EcoToken system." />
                <meta
                    name="viewport"
                    content="width=device-width, initial-scale=1"
                />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <div className="flex flex-col">
                <div className="flex w-full flex-col">
                    <PublicNavbar />
                </div>
                <div className="grid h-full w-full grid-flow-col grid-rows-[auto_minmax(0,max-content)] bg-slate-200/75">
                    <main className="mt-16 flex justify-center overflow-y-auto">
                        {children}
                    </main>
                    <div className="mb-20 flex w-full auto-rows-max flex-col">
                        {/* <PublicFooter /> */}
                    </div>
                </div>
            </div>
        </>
    );
};

export default DefaultLayout;
