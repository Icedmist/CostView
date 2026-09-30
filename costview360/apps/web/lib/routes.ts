import { normalizeSection } from "@/components/layout/sidebar";

export function getNavUrl(section: string, subSection?: string): string {
  const norm = normalizeSection(section);
  switch (norm) {
    case "Cost Plan":
      return subSection ? `/cost-plan/${subSection}` : `/cost-plan`;
    case "Buy & Supply":
      return subSection ? `/buy-and-supply/${subSection}` : `/buy-and-supply`;
    case "Site":
      return subSection ? `/site/${subSection}` : `/site`;
    case "Contracts":
      return subSection
        ? `/contracts/${subSection === "contracts" ? "ledger" : subSection}`
        : `/contracts`;
    case "Oversight":
    default:
      if (subSection === "reports") return `/reports`;
      if (subSection === "portal") return `/portal`;
      if (subSection === "telemetry") return `/dashboard/telemetry`;
      if (subSection === "admin") return `/dashboard/admin`;
      if (subSection === "my-work" || !subSection) return `/dashboard`;
      return `/dashboard/${subSection}`;
  }
}

export function parseNavPath(pathname: string): { section: string; subSection: string } {
  if (pathname.startsWith("/cost-plan")) {
    const parts = pathname.split("/").filter(Boolean);
    return { section: "Cost Plan", subSection: parts[1] || "boq" };
  }
  if (pathname.startsWith("/buy-and-supply")) {
    const parts = pathname.split("/").filter(Boolean);
    return { section: "Buy & Supply", subSection: parts[1] || "match" };
  }
  if (pathname.startsWith("/site")) {
    const parts = pathname.split("/").filter(Boolean);
    return { section: "Site", subSection: parts[1] || "hub" };
  }
  if (pathname.startsWith("/contracts")) {
    const parts = pathname.split("/").filter(Boolean);
    const sub = parts[1] || "ledger";
    return { section: "Contracts", subSection: sub === "ledger" ? "contracts" : sub };
  }
  if (pathname.startsWith("/reports")) {
    return { section: "Oversight", subSection: "reports" };
  }
  if (pathname.startsWith("/portal")) {
    return { section: "Oversight", subSection: "portal" };
  }
  if (pathname.startsWith("/settings")) {
    return { section: "Oversight", subSection: "admin" };
  }
  if (pathname.startsWith("/dashboard")) {
    const parts = pathname.split("/").filter(Boolean);
    return { section: "Oversight", subSection: parts[1] || "my-work" };
  }
  return { section: "Oversight", subSection: "my-work" };
}
