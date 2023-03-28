/*
 * Copyright (C) 2023 EcoToken Systems
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
 */

import { createTRPCRouter } from "../trpc";
import { adminAuthRouter } from "./admin/admin-auth";
import { adminUsersRouter } from "./admin/admin-users";
import { creditRouter } from "./credit";
import { locationsRouter, projectsRouter } from "./eco";
import { ordersRouter } from "./eco/eco-orders";
import { nftBuilderRouter } from "./nft-builder";
import { nftSeriesRouter } from "./nft-series";
import { permissionsRouter } from "./permissions";
import { coinPriceRouter } from "./price";
import { rolesRouter } from "./roles";
import { spacesRouter } from "./spaces";
import { userAuthRouter } from "./user/user-auth";
import { usersRouter } from "./user/users";
import { websiteRouter } from "./websites";

export const appRouter = createTRPCRouter({
    spaces: spacesRouter,
    adminAuth: adminAuthRouter,
    adminUsers: adminUsersRouter,
    users: usersRouter,
    ecoProjects: projectsRouter,
    ecoLocations: locationsRouter,
    ecoOrders: ordersRouter,
    websites: websiteRouter,
    userAuth: userAuthRouter,
    permissions: permissionsRouter,
    roles: rolesRouter,
    nftBuilder: nftBuilderRouter,
    nftSeries: nftSeriesRouter,
    coinPrice: coinPriceRouter,
    credit: creditRouter,
});

export type AppRouter = typeof appRouter;
