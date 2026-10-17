import { Tabs, TabsContent, TabsList, TabsTrigger } from "@workspace/ui/components/tabs"
import { AppShell } from "@workspace/ui/components/app-shell"
import { PageHeader } from "@workspace/ui/components/page-header"
import { Navbar } from "../../../ui/Navbar"
import { PortfolioTab } from "./portfolio/portfolio-tab"
import { DiscoverTab } from "./discover/discover-tab"
import { AdditionalOpportunitiesTab } from "./additional/additional-opportunities-tab"
import { DistributionsTab } from "./distributions/distributions-tab"

export function EarnPage() {
  return (
    <AppShell navbar={<Navbar variant="app" />} maxWidth="260">
      <PageHeader
        title="Earn"
        description="Stake SO4 and buy GLV or GM to earn rewards"
        tabs={
          <Tabs defaultValue="portfolio" className="gap-6">
            <TabsList className="h-9">
              <TabsTrigger value="portfolio">Portfolio</TabsTrigger>
              <TabsTrigger value="discover">Discover</TabsTrigger>
              <TabsTrigger value="additional">Additional opportunities</TabsTrigger>
              <TabsTrigger value="distributions">Distributions</TabsTrigger>
            </TabsList>

            <TabsContent value="portfolio">
              <PortfolioTab />
            </TabsContent>
            <TabsContent value="discover">
              <DiscoverTab />
            </TabsContent>
            <TabsContent value="additional">
              <AdditionalOpportunitiesTab />
            </TabsContent>
            <TabsContent value="distributions">
              <DistributionsTab />
            </TabsContent>
          </Tabs>
        }
      />
    </AppShell>
  )
}
