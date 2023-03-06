import React from "react";
import { useRouter } from "next/router";
import DefaultCard, {
    CardTitle,
    CardDescription,
} from "@ecotoken/ui/components/Card";
import Image from "next/image";
import Form, {
    FormInput,
    useZodForm,
    FormSelect,
} from "@ecotoken/ui/components/Form";
import credit_icon from "@ecotoken/ui/assets/icons/credits.svg";
import Button from "@ecotoken/ui/components/Button";
import { createEcoOrderSchema } from "@ecotoken/api/src/schema/order";
import { trpc } from "@/utils/trpc";
import { clientEnv } from "@/env/schema.mjs";
import Preview from "@/components/project/preveiw";

const omittedSchema = createEcoOrderSchema.omit({
    userWallet: true,
    payAmount: true,
    payFee: true,
    payHash: true,
    nftID: true,
});

const PurchaseProject = () => {
    const router = useRouter();
    const { id } = router.query;
    const { data: project } = trpc.ecoProjects.get.useQuery({
        url: id as string,
    });

    const { data: price } = trpc.coinPrice.get.useQuery({});

    const [creditType, setCreditType] = React.useState("RH20");
    const [currency, setCurrency] = React.useState("SOL");
    const [retrive, setRetrive] = React.useState("");
    const [location, setLocation] = React.useState("");

    const [credits, setCredits] = React.useState(100);

    const form = useZodForm({
        schema: omittedSchema,
    });

    if (!project || !project.projectID || !price) return <>Loading...</>;
    console.log(project);
    return (
        <div className="mx-2 mt-6 w-full">
            <div className="relative">
                <h1 className="absolute bottom-[1em] left-[2em] text-[48px] font-bold text-white">
                    {project.ecoTitle}
                </h1>
                <Image
                    src={`${clientEnv.NEXT_PUBLIC_CDN_URL}/${
                        JSON.parse(project.images).listImage
                    }`}
                    alt="EcoProject thumbnail image"
                    className=" h-60 min-h-[511px] w-full object-cover"
                    width={300}
                    height={200}
                />
            </div>
            <div className="my-[3em] flex px-[5em]">
                <div className="w-[50%]">
                    <h1 className="text-[24px] font-semibold">
                        {project.ecoTitle}
                    </h1>
                    <p className="mt-2 text-[18px] font-semibold text-[#656565]">{`${project.location.location} ${project.location.cn}, USA`}</p>
                    <div className="mt-5 flex gap-10">
                        <div className="flex flex-col gap-1">
                            <label className="text-[16px] text-[#7E7E7E]">
                                Credit type
                            </label>
                            <span className="text-[21px] font-semibold">
                                CO2
                            </span>
                        </div>
                        <div className="flex flex-col gap-1">
                            <label className="text-[16px] text-[#7E7E7E]">
                                Price Per Ton
                            </label>
                            <span className="text-[21px] font-semibold">
                                $25.43 USDT
                            </span>
                        </div>
                        <div className="flex flex-col gap-1">
                            <label className="text-[16px] text-[#7E7E7E]">
                                Credit Available
                            </label>
                            <span className="text-[21px] font-semibold">
                                4293.82
                            </span>
                        </div>
                    </div>
                    <div className="mt-10 grid w-full grid-cols-2 px-2 py-5">
                        <div className="w-full">
                            <Form
                                className="space-y-4"
                                method="post"
                                action=""
                                form={form}
                                onSubmit={(data) => {
                                    console.log(data);
                                }}
                            >
                                <FormInput
                                    className="mt-3 text-[#7E7E7E]"
                                    label={
                                        creditType
                                            ? `Number of Credits to purchase (${creditType})`
                                            : "Number of Credits to purchase"
                                    }
                                    type="number"
                                    size="full"
                                    defaultValue={100}
                                    {...form.register("creditAmount", {
                                        valueAsNumber: true,
                                    })}
                                    onChange={(e) => {
                                        setCredits(Number(e.target.value));
                                    }}
                                />
                                <FormSelect
                                    label="Purchase Currency"
                                    className="mt-3 text-[#7E7E7E]"
                                    size="full"
                                    {...form.register("payType")}
                                    onChange={(e) => {
                                        setCurrency(e.target.value);
                                    }}
                                >
                                    {createEcoOrderSchema.shape.payType.options.map(
                                        (type) => (
                                            <option key={type} value={type}>
                                                {type}
                                            </option>
                                        ),
                                    )}
                                </FormSelect>
                                <p className="py-5">
                                    Purchase Price:{" "}
                                    {Number(
                                        (credits * 1.5) /
                                            (currency === "SOL"
                                                ? price.data.solana.usd
                                                : 1),
                                    ).toFixed(2)}
                                </p>
                                <FormInput
                                    size="full"
                                    label="Retired By"
                                    className="mt-3"
                                    {...form.register("retireBy")}
                                    onChange={(e) => setRetrive(e.target.value)}
                                />
                                <FormInput
                                    className="mt-3"
                                    size="full"
                                    label="Your Location"
                                    {...form.register("userLocation")}
                                    onChange={(e) =>
                                        setLocation(e.target.value)
                                    }
                                />
                                <Button
                                    className="mt-4"
                                    fullWidth
                                    type="submit"
                                >
                                    Purchase Credits
                                </Button>
                            </Form>
                        </div>
                    </div>
                </div>
                <div className="mt-10 px-5">
                    <Preview
                        image={{
                            src: `/images/${
                                JSON.parse(project.images).listImage
                            }`,
                        }}
                        displayData={{ location }}
                    />
                </div>
            </div>
        </div>
    );
};

export default PurchaseProject;
