"use client";

import { redirect as nativeRedirect, usePathname } from "next/navigation";
import { Session } from "../lib/drizzle/schema";

interface RedirectHandler {
  session: Session | null;
}

const whitelist = ["/", "/steps/style", "/steps/questions", "/steps/finished"];

function RedirectHandler(props: RedirectHandler) {
  const { session } = props;
  const pathname = usePathname();

  function redirect(path: string) {
    if (path !== pathname) nativeRedirect(path);
  }

  if (!whitelist.includes(pathname)) return;

  if (session === null) {
    redirect("/");
    return;
  }

  switch (session.status) {
    case "styling":
      redirect("/steps/style");
      break;

    case "answering":
      redirect("/steps/questions");
      break;

    case "finished":
      redirect("/steps/finished");
      break;
  }

  return <></>;
}

export default RedirectHandler;
