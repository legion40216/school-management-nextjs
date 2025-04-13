import { unauthorized } from "next/navigation";
import { currentRole } from "./server-auth-utils";

export async function checkRoleAndRedirect(expectedRole) {
    const role = await currentRole();
  
    if (role !== expectedRole) {
      unauthorized("Access restricted: Teacher account required");
    }
  }