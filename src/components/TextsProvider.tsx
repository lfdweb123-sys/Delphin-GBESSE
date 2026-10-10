"use client";
import { createContext, useContext, type ReactNode } from "react";
import { DEFAULTS, type Texts } from "@/lib/texts";

const Ctx = createContext<Texts>(DEFAULTS);
export function TextsProvider({ texts, children }: { texts: Texts; children: ReactNode }) { return <Ctx.Provider value={texts}>{children}</Ctx.Provider>; }
export const useT = () => useContext(Ctx);
