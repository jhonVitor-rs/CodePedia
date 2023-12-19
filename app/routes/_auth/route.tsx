import { NavLink, Outlet } from "@remix-run/react";

export default function() {

  return(
    <div className="flex flex-col max-w-md w-full gap-2 items-center justify-center mx-auto my-14">
      <div className="bg-foreground/80 rounded-xl w-full p-1">
        <ul className="flex w-full items-center justify-center gap-2">
          <li className="flex w-1/2 justify-center">
            <NavLink 
              to={'/sign-in'}
              className={({isActive}) => 
                isActive ? "bg-background text-foreground w-full rounded-xl p-2 text-center" : 
                "bg-slate-400 text-background w-full rounded-xl p-2 text-center"
              }
            >
              Sign In
            </NavLink>
          </li>
          <li className="flex w-1/2 justify-center">
            <NavLink    
              to={'/sign-up'}
              className={({isActive}) => 
                isActive ? "bg-background text-foreground w-full rounded-xl p-2 text-center" : 
                "bg-slate-400 text-background w-full rounded-xl p-2 text-center"
              }
            >
              Sign Up
            </NavLink>
          </li>
        </ul>
      </div>
      <Outlet/>
    </div>
  )
}
