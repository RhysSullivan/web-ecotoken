import { PrismaClient, type Prisma } from "@prisma/client";
import { hash } from "argon2";

const prisma = new PrismaClient();

type CreateRoleOperation = Omit<
    Prisma.RoleCreateInput,
    "permissions" | "sites"
> & {
    permissions?: string[];
    sites?: string[];
};

type CreateLocationOperation = Omit<Prisma.EcoLocationCreateInput, "site"> & {
    site: string;
};

type CreateUserOperation = Omit<
    Prisma.UserCreateInput,
    "role" | "roleID" | "site" | "siteID"
> & {
    role: string;
    site: string;
};

type CreateProjectOperation = Omit<
    Prisma.EcoProjectCreateInput,
    | "site"
    | "siteID"
    | "benefits"
    | "location"
    | "locationID"
    | "producer"
    | "producerID"
> & {
    site: string;
    location: string;
    producer: string;
    benefits: string[];
};

type NftSeriesOperation = Omit<
    Prisma.NFTSeriesCreateInput,
    "project" | "projectID"
> & {
    project: string;
};

const rolesToCreate: CreateRoleOperation[] = [
    {
        role: "Admin",
        domain: "ADMIN",
        permissions: ["ROLES_CONFIG", "PERMISSION_CONFIG"],
        sites: ["ecoToken", "ecoToken Admin"],
    },
    {
        role: "Producer",
        domain: "USER",
        permissions: [],
        sites: ["ecoToken"],
    },
    {
        role: "Verifier",
        domain: "USER",
        permissions: [],
        sites: ["ecoToken"],
    },
    {
        role: "User",
        domain: "USER",
        permissions: [],
        sites: ["ecoToken"],
    },
];

const locationsToCreate: CreateLocationOperation[] = [
    {
        location: "Leduc",
        cn: "CA",
        st: "AB",
        site: "ecoToken",
    },
    {
        location: "Calgary",
        cn: "CA",
        st: "AB",
        site: "ecoToken",
    },
    {
        location: "Pincher Creek",
        cn: "CA",
        st: "AB",
        site: "ecoToken",
    },
    {
        location: "Howe Sound",
        cn: "CA",
        st: "BC",
        site: "ecoToken",
    },
    {
        location: "Central Valley",
        cn: "US",
        st: "CA",
        site: "ecoToken",
    },
    {
        location: "King County",
        cn: "US",
        st: "WA",
        site: "ecoToken",
    },
    {
        location: "Lexington",
        cn: "US",
        st: "OH",
        site: "ecoToken",
    },
    {
        location: "Orlando",
        cn: "US",
        st: "FL",
        site: "ecoToken",
    },
];

const usersToCreate: CreateUserOperation[] = [
    {
        email: "realdinozoid@gmail.com",
        walletAddress: "37w6QjJGkH5EZq1sz7xAqP7mHCnT6xTKVk6m5XCmG8dk1",
        firstName: "Ean",
        lastName: "Last",
        username: "dingo",
        role: "Producer",
        site: "ecoToken",
        companyName: "ecoToken",
    },
    {
        email: "alan@noahsolutions.com",
        walletAddress: "1",
        firstName: "Alan",
        lastName: "http://noahsolutions.ca/",
        username: "alan",
        role: "Producer",
        site: "ecoToken",
        companyName: "NOAH Solutions",
    },
    {
        email: "aaron@wacomet.com ",
        walletAddress: "2",
        firstName: "Alan",
        lastName: "https://www.rh2o.app",
        username: "aaron",
        role: "Producer",
        site: "ecoTokenp",
        companyName: "Wacomet Water Co.",
    },
    {
        email: "admin@gmail.com",
        walletAddress: "3",
        lastName: "https://wrlandconservancy.org/",
        role: "Producer",
        site: "ecoToken",
        companyName: "Western Reserve Land Conservancy ",
    },
    {
        email: "user@kingcounty.gov",
        walletAddress: "4",
        lastName: "https://kingcounty.gov/depts/dnrp.aspx",
        username: "kingcounty",
        role: "Producer",
        site: "ecoToken",
        companyName: "King County Department of Natural Resources and Parks",
    },
    {
        email: "user@regen.network",
        walletAddress: "7",
        lastName: "https://regen.network",
        username: "Regen",
        role: "Verifier",
        site: "ecoToken",
        companyName: "Regen Network",
    },
];

const projectsToCreate: CreateProjectOperation[] = [
    {
        title: "Dairy Manure Remediation",
        shortTitle: "Dairy Manure Remediation",
        identifier: "DairyManure001",
        producer: "NOAH Solutions",
        intro: "Manure treatment to tackle Greenhouse Gas, manure odor and groundwater contamination.",
        location: "Leduc",
        benefits: [
            "Animal Welfare",
            "Ecosystem Health",
            "Greenhouse Gas",
            "Groundwater Quality",
        ],
        project: "",
        overview: "",
        process: "",
        listImage:
            "https://eco-token.io/images/ecoproject/head_dairy_cows01.jpg",
        headImage:
            "https://eco-token.io/images/ecoproject/head_3m_Lagoon01.jpg",
        site: "ecoToken",
        status: "ACTIVE",
        creditType: "CARBON",
        fundAmount: 80000,
        fundRecieved: 2000,
        return: 1.5,
        dateStart: new Date("2022-05-01"),
        dateEnd: new Date("2022-09-30"),
    },
    {
        title: "Green Waste Treatment in Calgary Alberta",
        shortTitle: "Green Waste Treatment",
        identifier: "Organics001",
        producer: "NOAH Solutions",
        intro: "Green waste in landfills generates large quantities of methane. This project will render it into a plant nutrient, while reducing greenhouse gasses and leading to groundwater improvement.",
        location: "Calgary",
        benefits: [
            "Ecosystem Health",
            "Greenhouse Gas",
            "Groundwater Quality",
            "Surface Water",
        ],
        project: "",
        overview: `Reduction in methane gas\n
        Reduced organics to landfill\n
        Creation of plant nutrient\n
        Elimination of odor`,
        process: "",
        listImage:
            "https://eco-token.io/images/ecoproject/head_harvest_recyling.jpg",
        headImage:
            "https://eco-token.io/images/ecoproject/head_harvest_recyling.jpg",
        site: "ecoToken",
        status: "ACTIVE",
        creditType: "CARBON",
        fundAmount: 75000,
        fundRecieved: 2500,
        return: 1.25,
        dateStart: new Date("2022-04-01"),
        dateEnd: new Date("2022-12-31"),
    },
    {
        title: "Ranchland Groundwater Treatment",
        shortTitle: "Groundwater Treatment",
        identifier: "Groundwater001",
        producer: "NOAH Solutions",
        intro: "Excessive fecal matter from cattle herds can affect local groundwater, making it unhealthy for the cattle and other animals.",
        location: "Pincher Creek",
        benefits: [
            "Animal Welfare",
            "Ecosystem Health",
            "Greenhouse Gas",
            "Groundwater Quality",
            "Surface Water",
        ],
        project: "",
        overview: `Improved surface water quality\n
        Improved health for livestock\n
        Healthy water for downstream interactions`,
        process: "",
        listImage:
            "https://eco-token.io/images/ecoproject/head_mitchell_pond.jpg",
        headImage:
            "https://eco-token.io/images/ecoproject/head_mitchell_cows02.jpg",
        site: "ecoToken",
        status: "ACTIVE",
        creditType: "CARBON",
        fundAmount: 30000,
        fundRecieved: 1000,
        return: 0.25,
        dateStart: new Date("2022-11-16"),
        dateEnd: new Date("2022-09-30"),
    },
    {
        title: "Ocean Wise - Howe Sound Seaforestation",
        shortTitle: "Ocean Wise - Howe Sound Seaforestation",
        identifier: "Oceanwise001",
        producer: "NOAH Solutions",
        intro: "Kelp forests are rich habitat for marine life, including commercially important fish and invertebrates. Kelp naturally capture carbon in large volumes some of which gets trapped in the ocean floor for centuries.",
        location: "Howe Sound",
        benefits: ["Ecosystem Health", "Greenhouse Gas", "Ocean Health"],
        project: "",
        overview: `5,000ha of kelp will be restored and cultivated\n
        14,600 tonnes of CO2 stored\n
        Restore marine habitat\n
        Combat ocean acidification\n
        Creating economic opportunities for Indigenous and coastal communities`,
        process: "",
        listImage:
            "https://eco-token.io/images/ecoproject/head_oceanwise_kelp01.jpg",
        headImage:
            "https://eco-token.io/images/ecoproject/head_oceanwise_kelp01.jpg",
        site: "ecoToken",
        status: "DATA_ENTRY",
        creditType: "WATER",
        fundAmount: 70000,
        fundRecieved: 8000,
        return: 1.5,
        dateStart: new Date("2022-09-07"),
        dateEnd: new Date("2023-12-24"),
    },
    {
        title: "Sandy Cross Forest Preservation Project",
        shortTitle: "Sandy Cross Forest Preservation",
        identifier: "Sandycross001",
        producer: "Western Reserve Land Conservatory",
        intro: "The Sandy Cross Forest Preservation Project is a 132-acre Project Area on a 214-acre property in the Mansfield metro area. Western Reserve Land Conservancy is seeking to preserve the Project, creating substantial conservation and community benefits including carbon sequestration, wildlife habitat, and open space protection.",
        location: "Lexington",
        benefits: ["Preservation", "Wildlife Habitat", "Climate"],
        project: `<p>The Sandy Cross Forest Preservation Project is a 132-acre Project Area on a 214-acre property in the Mansfield metro area. Western Reserve Land Conservancy is seeking to preserve the Project, creating substantial conservation and community benefits including carbon sequestration, wildlife habitat, and open space protection. </p> 
        <p>Preservation of the Project is important as intact forests of this size are becoming increasingly rare in Richland County due to agricultural development and urban expansion. Indeed, surrounding forested land is being rapidly converted into agricultural land and is facing a continued threat of urban expansion from the adjacent Village of Lexington.
        </p> <p>The Project contains a diverse, 85-year forest including yellow poplar, sugar maple, oak, black cherry, and pine. Preservation of this forest will offer the residents of Northeast Ohio a wide variety of community and conservation benefits.</p>`,
        overview: `<p><b>Offset Generation Method</b><br>Avoided Emissions</p>
        <p><b>Project Activity</b><br>Tree Preservation</p>
        <p><b>Project Type</b><br>Agriculture Forestry and Other Land Use</p>
        <p><b>Documents</b><br><a href="https://www.cityforestcredits.org/wp-content/uploads/2021/07/Sandy-Cross-Project-Design-Document-1.pdf" target="_new">Project Design Document</a></p>
        <p><b>Reference ID (cfc project id)</b><br><a href="https://www.cityforestcredits.org/carbon-credits/carbon-registry/mansfield-forest-carbon-offsets/" target="_new">Sandy Cross Forest</a></p>
        <p><b>Offset Protocol</b><br><a href="https://www.cityforestcredits.org/wp-content/uploads/2022/07/City-Forest-Preservation-Protocol-40-Years-V11.40.pdf" target="_new">Preservation Protocol - 40 years</a></p>`,
        process: "",
        listImage:
            "https://regen-registry-server.herokuapp.com/image/projects/C02/sandy-cross.jpg",
        headImage:
            "https://regen-registry-server.herokuapp.com/image/projects/C02/sandy-cross.jpg",
        site: "ecoToken",
        status: "DATA_ENTRY",
        creditType: "CARBON",
        fundAmount: 0,
        fundRecieved: 0,
        return: 0,
        dateStart: new Date("2021-10-14"),
        dateEnd: new Date("2061-10-14"),
    },
    {
        title: "King County Urban Forest Carbon Project",
        shortTitle: "King County Urban Forest",
        identifier: "KingCounty001",
        producer: "King County Department of Natural Resources and Parks",
        intro: "Launched in May 2019, King County’s Forest Carbon Project confronts climate change by offering local companies the opportunity to offset their carbon emissions by keeping forests intact here in the region, making it possible for their employees and their families to explore and enjoy the protected outdoor spaces.",
        location: "King County",
        benefits: ["Preservation", "Wildlife Habitat", "Climate"],
        project: `<p>Launched in May 2019, King County’s Forest Carbon Project confronts climate change by offering local companies the opportunity to offset their carbon emissions by keeping forests intact here in the region, making it possible for their employees and their families to explore and enjoy the protected outdoor spaces.
</p> 
<p>Preservation of the Project is important as intact forests of this size are becoming increasingly rare in Richland County due to agricultural development and urban expansion. Indeed, surrounding forested land is being rapidly converted into agricultural land and is facing a continued threat of urban expansion from the adjacent Village of Lexington.
</p> <p>The Project contains a diverse, 85-year forest including yellow poplar, sugar maple, oak, black cherry, and pine. Preservation of this forest will offer the residents of Northeast Ohio a wide variety of community and conservation benefits.</p>`,
        overview: `<p><b>Offset Generation Method</b><br>Avoided Emissions</p>
        <p><b>Project Activity</b><br>Tree Preservation</p>
        <p><b>Project Type</b><br>Agriculture Forestry and Other Land Use</p>
        <p><b>Documents</b><br><a href="https://www.cityforestcredits.org/wp-content/uploads/2021/07/Sandy-Cross-Project-Design-Document-1.pdf" target="_new">Project Design Document</a></p>
        <p><b>Reference ID (cfc project id)</b><br><a href="https://www.cityforestcredits.org/carbon-credits/carbon-registry/mansfield-forest-carbon-offsets/" target="_new">Sandy Cross Forest</a></p>
        <p><b>Offset Protocol</b><br><a href="https://www.cityforestcredits.org/wp-content/uploads/2022/07/City-Forest-Preservation-Protocol-40-Years-V11.40.pdf" target="_new">Preservation Protocol - 40 years</a></p>`,
        process: "",
        listImage:
            "https://regen-registry-server.herokuapp.com/image/projects/C02/kings-county.jpg",
        headImage:
            "https://regen-registry-server.herokuapp.com/image/projects/C02/kings-county.jpg",
        site: "ecoToken",
        status: "ACTIVE",
        creditType: "CARBON",
        fundAmount: 0,
        fundRecieved: 0,
        return: 0,
        dateStart: new Date("2018-12-14"),
        dateEnd: new Date("2118-12-14"),
    },
];

const nftSeriesToCreate: NftSeriesOperation[] = [
    {
        project: "Oceanwise001",
        seriesName: "Oceanwise001",
        seriesImage: "",
        seriesType: "C02",
        regenBatch: "C02-002",
        setAmount: 1200,
        totalCredits: 1500,
        creditPrice: 29.45,
        retireWallet: "",
        recieveWallet: "",
        creditWallet: "",
        creditKey: "",
    },
    {
        project: "KingCounty001",
        seriesName: "KingCounty001",
        seriesImage: "",
        seriesType: "C02",
        regenBatch: "C02-001-20180101-20181231-001",
        setAmount: 5553,
        totalCredits: 26,
        creditPrice: 31.45,
        retireWallet: "",
        recieveWallet: "",
        creditWallet: "",
        creditKey: "",
    },
    // {
    //     project: "Sandycross001",
    //     seriesName: "Sandycross001",
    //     seriesImage: "",
    //     seriesType: "C02",
    //     regenBatch: "C02-002-20211012-20241013-001",
    //     setAmount: 5553,
    //     totalCredits: 6497,
    //     creditPrice: 30.25,
    //     retireWallet: "",
    //     recieveWallet: "",
    //     creditWallet: "",
    //     creditKey: "",
    // },
];

const main = async () => {
    // wipe old data,
    console.log("Deleting data...");
    await prisma.nFTSeries.deleteMany();
    await prisma.ecoProject.deleteMany();
    await prisma.ecoBenefit.deleteMany();
    await prisma.ecoLocation.deleteMany();
    await prisma.user.deleteMany();
    await prisma.adminUser.deleteMany();
    await prisma.site.deleteMany();
    await prisma.permission.deleteMany();
    await prisma.role.deleteMany();
    console.log("Deleted data.");

    await prisma.$queryRaw`ALTER TABLE eco_location AUTO_INCREMENT = 1`;
    console.log("Reset auto increments.");

    // reseed
    await prisma.site.createMany({
        data: [
            {
                siteName: "ecoToken",
                legalName: "ecoToken System Inc.",
                devUrl: "localhost:3000",
                stageUrl: "smy.eco-token.io",
                prodUrl: "my.ecotoken.io",
            },
            {
                siteName: "ecoToken Admin",
                devUrl: "localhost:3001",
                stageUrl: "admin.eco-token.io",
                prodUrl: "admin.ecotoken.io",
            },
            {
                siteName: "ecoWarriors",
                devUrl: "localhost:3004",
                stageUrl: "stg.ecowarriors.com",
                prodUrl: "www.ecowarriors.com",
            },
        ],
    });
    console.log("Created sites.");

    await prisma.permission.createMany({
        data: [
            {
                domain: "ADMIN",
                permission: "ADMIN_LEVEL01",
                description:
                    "Admin can view basic admin data, minimal editing.",
            },
            {
                domain: "ADMIN",
                permission: "ADMIN_LEVEL02",
                description:
                    "Admin can view and edit low level administration components.",
            },
            {
                domain: "ADMIN",
                permission: "ADMIN_LEVEL03",
                description:
                    "Admin can view and edit medium level administration components.",
            },
            {
                domain: "ADMIN",
                permission: "ADMIN_LEVEL04",
                description:
                    "Admin can view and edit top level administration components, that are in Beta or Above.",
            },
            {
                domain: "ADMIN",
                permission: "ADMIN_LEVEL05",
                description: "Developer level access to everything.",
            },
            {
                domain: "ADMIN",
                permission: "ADMIN_USER_VIEW",
                description: "Can see current admin users.",
            },
            {
                domain: "ADMIN",
                permission: "ADMIN_USER_EDIT",
                description: "Can add and edit admin users.",
            },
            {
                domain: "ADMIN",
                permission: "USER_EDIT_FULL",
                description: "Admin can edit full user account.",
            },
            {
                domain: "ADMIN",
                permission: "USER_EDIT_KYC",
                description: "Admin can edit KYC components of user account.",
            },
            {
                domain: "ADMIN",
                permission: "USER_EDIT_PRODUCER",
                description:
                    "Admin can edit Producer components of user account.",
            },
            {
                domain: "ADMIN",
                permission: "PROJECT_VIEW",
                description: "Admin can view existing projects.",
            },
            {
                domain: "ADMIN",
                permission: "PROJECT_EDIT",
                description: "Admin can add new and edit existing projects.",
            },
            {
                domain: "ADMIN",
                permission: "PROJECT_ACCOUNTING",
                description:
                    "Admin manage the money transfers between ecoToken and projects.",
            },
            {
                domain: "ADMIN",
                permission: "ROLES_CONFIG",
                description: "Admin can create and manage roles.",
            },
            {
                domain: "ADMIN",
                permission: "PERMISSION_CONFIG",
                description: "Admin can create and manage permissions.",
            },
            {
                domain: "USER",
                permission: "USER_PARTNER",
                description: "User has been accepted as a Partner.",
            },
            {
                domain: "USER",
                permission: "USER_PARTNER_APP",
                description: "User has applied to become a Partner.",
            },
            {
                domain: "USER",
                permission: "USER_REGISTERED",
                description:
                    "User has logged in after receiving email from Registration form.",
            },
            {
                domain: "USER",
                permission: "USER_REWARDS",
                description:
                    "User can manage ecoRewards (convert to ecoTokens and send to Wallet).",
            },
            {
                domain: "USER",
                permission: "USER_SUSPENDED",
                description: "User can view, no editing.",
            },
            {
                domain: "USER",
                permission: "USER_VERIFIED",
                description:
                    "User has full permission to access for planting, staking, claiming rewards, and managing accounts.",
            },
        ],
    });
    console.log("Created permissions.");

    for (const { permissions, sites, ...role } of rolesToCreate) {
        const selectedSites = await prisma.site.findMany({
            where: {
                OR: sites?.map((site) => ({
                    siteName: site,
                })),
            },
        });
        await prisma.role.create({
            data: {
                ...role,
                permissions: {
                    connect: permissions?.map((permission) => ({
                        permission,
                    })),
                },
                sites: {
                    connect: selectedSites?.map(({ siteID }) => ({
                        siteID,
                    })),
                },
            },
        });
    }
    console.log("Created roles.");

    for (const { site, role, ...remaining } of usersToCreate) {
        const selectedSite = await prisma.site.findFirst({
            where: {
                siteName: site,
            },
        });
        const selectedRole = await prisma.role.findFirst({
            where: {
                role: role,
            },
        });
        if (selectedSite && selectedRole)
            await prisma.user.create({
                data: {
                    ...remaining,
                    siteID: selectedSite.siteID,
                    roleID: selectedRole.roleID,
                },
            });
    }
    console.log("Created users.");

    await prisma.ecoBenefit.createMany({
        data: [
            {
                bftTitle: "Animal Welfare",
                benefit:
                    "Modern farming techniques can negatively impact the environment. This project is designed to bring health to both the environment and as a result the animals that interact with it.",
            },
            {
                bftTitle: "Surface Water",
                benefit:
                    "Small creeks and river are best suited for sustaining small migrating herds rather than large herds that remain in one place.",
            },
            {
                bftTitle: "Ecosystem Health",
                benefit:
                    "A healthy ecosystem is one where natural processes are in balance functioning optimally. It has the resilency to respond to changes environment.",
            },
            {
                bftTitle: "Ocean Health",
                benefit: "",
            },
            {
                bftTitle: "Greenhouse Gas",
                benefit:
                    "This project is designed to reduce the amount of greenhouse gas that is entering the atmosphere.",
            },
            {
                bftTitle: "Groundwater Quality",
                benefit:
                    "Waste from animal feces and refuse in landfills can seep into the groundwater. This project is designed to reduce the contamination of the water supply.",
            },
        ],
    });
    console.log("Created ecoBenefits.");

    console.log("Creating ecoLocations...");
    for (const { site, ...remaining } of locationsToCreate) {
        const selectedSite = await prisma.site.findFirst({
            where: {
                siteName: site,
            },
        });
        if (selectedSite)
            await prisma.ecoLocation.create({
                data: {
                    ...remaining,
                    siteID: selectedSite.siteID,
                },
            });
        console.log("Created " + remaining.location);
    }
    console.log("Created ecoLocations.");

    console.log("Creating ecoProjects...");
    for (const {
        site,
        location,
        benefits,
        producer,
        ...project
    } of projectsToCreate) {
        const selectedProducer = await prisma.user.findFirst({
            where: {
                companyName: producer,
                role: {
                    role: "Producer",
                },
            },
        });
        const selectedSite = await prisma.site.findFirst({
            where: {
                siteName: site,
            },
        });
        const selectedLocation = await prisma.ecoLocation.findFirst({
            where: {
                location,
            },
        });
        const selectedBenefits = await prisma.ecoBenefit.findMany({
            where: {
                OR: benefits?.map((benefit) => ({
                    benefit,
                })),
            },
        });
        if (
            selectedBenefits &&
            selectedLocation &&
            selectedProducer &&
            selectedSite
        ) {
            // bad way to seed projects
            const databaseProject = await prisma.ecoProject.create({
                data: {
                    ...project,
                    producer: {
                        connect: {
                            userID: selectedProducer.userID,
                        },
                    },
                    site: {
                        connect: {
                            siteID: selectedSite.siteID,
                        },
                    },
                    location: {
                        connect: {
                            locationID: selectedLocation.locationID,
                        },
                    },
                    benefits: {
                        connect: selectedBenefits?.map(({ benefitID }) => ({
                            benefitID,
                        })),
                    },
                },
            });
            console.log("Created " + databaseProject.shortTitle);
        }
    }
    console.log("Created ecoProjects.");

    console.log("Creating nftSeries...");
    for (const { project, ...series } of nftSeriesToCreate) {
        const selectedProject = await prisma.ecoProject.findFirst({
            where: {
                identifier: project,
            },
        });
        await prisma.nFTSeries.create({
            data: {
                ...series,
                projectID: selectedProject!.projectID,
            },
        });
        console.log("Created " + series.seriesName);
    }
    console.log("Created nftSeries.");

    const roles = await prisma.role.findMany();
    await prisma.adminUser.createMany({
        data: [
            {
                username: "Randalf",
                email: "randy@eco-token.io",
                firstName: "Randy",
                lastName: "Christie",
                password: await hash("password123"),
                roleID: roles.find((role) => role.role === "Admin")!.roleID,
            },
            {
                username: "dingo",
                email: "keean@eco-token.io",
                firstName: "Ean",
                lastName: "Last",
                password: await hash("password123"),
                roleID: roles.find((role) => role.role === "Admin")!.roleID,
            },
            {
                username: "Naruto25",
                email: "dennis1125stephens@gmail.com",
                firstName: "Dennis",
                lastName: "Stephens",
                password: await hash("password123"),
                roleID: roles.find((role) => role.role === "Admin")!.roleID,
            },
        ],
    });
    console.log("Created admin users.");
};

main();
