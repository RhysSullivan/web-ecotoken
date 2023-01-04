import { PrismaClient } from "@prisma/client";
import { hash } from "argon2";

const prisma = new PrismaClient();

const main = async () => {
	// wipe old data,
	await prisma.ecoProject.deleteMany();
	await prisma.user.deleteMany();
	await prisma.adminUser.deleteMany();
	await prisma.site.deleteMany();

	console.log("Deleting data...");
	// reseed
	await prisma.ecoProject.createMany({
		data: [
			{
				title: "Dairy Manure Remediation",
				url: "DairyManure001",
				fundAmount: 85000,
				fundRecieved: 16100,
				location: "Leduc, Alberta, Canada",
				status: "OPEN",
				images: JSON.stringify({
					listImage: "ecoproject/head_dairy_cows01.jpg",
					head1: "ecoproject/head_3m_Lagoon01.jpg",
					head2: "ecoproject/head_dairy_cows01.jpg",
					head3: "ecoproject/head_manure_01.jpg"
				}),
				outcome: "Design and test remediation technology",
				ord: 0
			},
			{
				title: "Dairy Manure Remediation",
				url: "DairyManure002",
				fundAmount: 28000,
				fundRecieved: 28000,
				location: "Deroche, British Columbia, Canada",
				status: "OPEN",
				images: JSON.stringify({
					listImage: "ecoproject/head_manure_01.jpg",
					head1: "ecoproject/head_harvest_recyling.jpg",
					head2: "ecoproject/head_harvest_food01.jpg",
					head3: "ecoproject/head_harvest_frontloader.jpg"
				}),
				outcome: "Establish Protocols for GHGe Reduction",
				ord: 1
			},
			{
				title: "Green Waste Treatment",
				url: "Organics001",
				fundAmount: 125000,
				fundRecieved: 125000,
				location: "Calgary, Alberta, Canada",
				status: "OPEN",
				images: JSON.stringify({
					listImage: "ecoproject/head_harvest_recyling.jpg",
					head1: "ecoproject/head_mitchell_pond.jpg",
					head2: "ecoproject/head_mitchell_cows01.jpg",
					head3: "ecoproject/head_mitchell_cows02.jpg"
				}),
				outcome: "Determine potential throughput of organic waste",
				ord: 2
			},
			{
				title: "Groundwater Treatment",
				url: "Groundwater001",
				fundAmount: 45000,
				fundRecieved: 100,
				location: "Pincher Creek, Alberta, Canada",
				status: "OPEN",
				images: JSON.stringify({
					listImage: "ecoproject/head_mitchell_pond.jpg"
				}),
				outcome: "Improved groundwater health for cattle",
				ord: 3
			},
			{
				title: "Ocean Wise - Seaforestation",
				url: "Oceanwise001",
				fundAmount: 85000,
				fundRecieved: 14000,
				location: "Howe Sound, British Columbia",
				status: "OPEN",
				images: JSON.stringify({
					listImage: "ecoproject/head_oceanwise_kelp01.jpg"
				}),
				outcome: "14,600 GHGe reduction over 5 years",
				ord: 3
			}
		]
	});
	console.log("Created projects.");
	await prisma.site.createMany({
		data: [
			{
				siteName: "ecoToken",
				legalName: "ecoToken System Inc.",
				devUrl: "localhost:3000",
				stageUrl: "smy.eco-token.io",
				prodUrl: "my.ecotoken.io"
			},
			{
				siteName: "ecoToken Admin",
				devUrl: "localhost:3001",
				stageUrl: "admin.eco-token.io",
				prodUrl: "admin.ecotoken.io"
			},
			{
				siteName: "ecoWarriors",
				devUrl: "localhost:3004",
				stageUrl: "stg.ecowarriors.com",
				prodUrl: "www.ecowarriors.com"
			}
		]
	});
	console.log("Created sites.");
	await prisma.adminUser.createMany({
		data: [
			{
				username: "Randalf",
				email: "randy@eco-token.io",
				firstName: "Randy",
				lastName: "Christie",
				password: await hash("password123")
			},
			{
				username: "dingo",
				email: "keean@eco-token.io",
				firstName: "Ean",
				lastName: "Last",
				password: await hash("password123")
			}
		]
	});
	console.log("Created admin users.");
};

main();
