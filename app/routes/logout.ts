import type { LoaderFunction} from "@remix-run/node";
import { logout } from "~/server/auth.server";

export const loader: LoaderFunction = async ({request}) => logout(request)