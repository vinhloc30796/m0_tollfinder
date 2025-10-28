export function getEnv(key: string): string | undefined {
  console.log("getEnv debug:", {
    hasMeta: typeof import.meta !== "undefined",
    hasMetaEnv: !!(import.meta as any)?.env,
    metaEnvKeys: (import.meta as any)?.env ? Object.keys((import.meta as any).env) : [],
    hasProcess: typeof process !== "undefined",
    hasProcessEnv: typeof process !== "undefined" && !!process.env,
    requestedKey: key,
  });

  // Print entire import.meta.env if it exists
  if ((import.meta as any)?.env) {
    console.log("Full import.meta.env:", (import.meta as any).env);
  }

  // Print entire process.env if it exists
  // @ts-ignore
  if (typeof process !== "undefined" && process.env) {
    // @ts-ignore
    console.log("Full process.env:", process.env);
  }

  const viteVal = (import.meta as any)?.env?.[key];
  // @ts-ignore
  const nodeVal = typeof process !== "undefined" ? process.env?.[key] : undefined;
  const finalResult = viteVal ?? nodeVal ?? undefined;
  console.log("getEnv result:", {
    viteVal,
    nodeVal,
    finalResult,
  });
  return finalResult;
}
