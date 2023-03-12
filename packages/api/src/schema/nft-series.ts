import { z } from "zod";

import { decimal } from "./utils";

export const createNFTSeriesSchema = z.object({
    nftSeriesID: z.string().cuid().optional(),
    projectID: z
        .string()
        .cuid()
        .min(1, "A project is required to create an NFT series."),
    producerID: z.string().cuid().min(1, "A producer is required."),
    seriesName: z.string().min(1, "A series name is required."),
    seriesImage: z.string().url("Please specify a base image URL."),
    seriesNumber: z.number().min(0, "A positive series number is required."),
    seriesType: z.string().min(1, "A series type is required."),
    retireWallet: z.string().min(1, "This wallet address is required."),
    recieveWallet: z.string().min(1, "This wallet address is required."),
    creditWallet: z.string().min(1, "This wallet address is required."),
    creditKey: z
        .string()
        .min(
            1,
            "A credit wallet private key is required for this series to operate.",
        ),
    totalCredits: decimal(12, 6),
    creditPrice: decimal(12, 6),
    regenBatch: z
        .string()
        .min(1, "A regen batch is required to create a NFT series."),
});
