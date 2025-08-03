"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Brain, TrendingUp, Clock, CheckCircle, AlertTriangle, Sparkles, RefreshCw } from "lucide-react"

const aiSummaries = [
  {
    id: 1,
    client: "Acme Corporation",
    projectName: "Brand Identity Design",
    summary:
      "Project is progressing well with 85% completion. The client has approved the logo concepts and color palette. Currently working on brand guidelines. Expected completion by January 15th.",
    insights: [
      "Client response time has improved by 40% this week",
      "All major deliverables are on track",
      "High client satisfaction based on feedback sentiment",
    ],
    riskLevel: "Low",
    nextActions: [
      "Complete brand guidelines document",
      "Prepare final presentation materials",
      "Schedule client review meeting",
    ],
    lastUpdated: "2 hours ago",
  },
  {
    id: 2,
    client: "TechStart Inc",
    projectName: "Website Redesign",
    summary:
      "Project at 60% completion with some delays in wireframe approval. Client requested additional revisions to the user flow. Timeline may need adjustment.",
    insights: [
      "Client feedback cycle is longer than average",
      "Scope creep detected in recent communications",
      "Budget utilization at 45% - within normal range",
    ],
    riskLevel: "Medium",
    nextActions: ["Schedule stakeholder alignment meeting", "Clarify scope boundaries", "Update project timeline"],
    lastUpdated: "4 hours ago",
  },
  {
    id: 3,
    client: "InnovateLab",
    projectName: "Mobile App UI",
    summary:
      "Project successfully completed ahead of schedule. Client expressed high satisfaction with the final deliverables. All acceptance criteria met.",
    insights: [
      "Project completed 3 days early",
      "Client satisfaction score: 9.5/10",
      "Zero change requests in final phase",
    ],
    riskLevel: "None",
    nextActions: ["Collect final testimonial", "Archive project files", "Prepare case study"],
    lastUpdated: "1 day ago",
  },
  {
    id: 4,
    client: "GrowthCo",
    projectName: "Marketing Materials",
    summary:
      "Early stage project with 30% completion. Initial concepts have been well-received. Client is responsive and engaged in the creative process.",
    insights: [
      "Strong client engagement in early phases",
      "Creative direction aligned with brand goals",
      "Resource allocation optimal for current phase",
    ],
    riskLevel: "Low",
    nextActions: [
      "Develop remaining concept variations",
      "Prepare mid-project review",
      "Confirm final deliverable specifications",
    ],
    lastUpdated: "6 hours ago",
  },
]

const overallInsights = {
  totalProjects: 4,
  avgCompletion: 68,
  onTimeDelivery: 85,
  clientSatisfaction: 9.2,
  riskDistribution: {
    low: 3,
    medium: 1,
    high: 0,
  },
}

export default function AISummaryPage() {
  const getRiskColor = (risk: string) => {
    switch (risk) {
      case "Low":
        return "bg-green-500/20 text-green-400 border-green-500/30"
      case "Medium":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
      case "High":
        return "bg-red-500/20 text-red-400 border-red-500/30"
      case "None":
        return "bg-blue-500/20 text-blue-400 border-blue-500/30"
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/30"
    }
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between animate-fade-in">
          <div>
            <h1 className="text-3xl font-montserrat font-bold flex items-center">
              <Brain className="w-8 h-8 mr-3 text-pink-500" />
              AI Project Insights
            </h1>
            <p className="text-muted-foreground mt-2">
              AI-powered analysis of your project progress and client relationships
            </p>
          </div>
          <Button className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 transition-all duration-200 hover:scale-105">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh Analysis
          </Button>
        </div>

        {/* Overall Insights */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-slide-in">
          <Card className="glass-effect">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Avg. Completion</CardTitle>
              <TrendingUp className="w-4 h-4 text-pink-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-montserrat font-bold">{overallInsights.avgCompletion}%</div>
              <Progress value={overallInsights.avgCompletion} className="mt-2 h-2" />
            </CardContent>
          </Card>

          <Card className="glass-effect">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">On-Time Delivery</CardTitle>
              <Clock className="w-4 h-4 text-purple-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-montserrat font-bold">{overallInsights.onTimeDelivery}%</div>
              <p className="text-xs text-green-400 mt-1">Above industry average</p>
            </CardContent>
          </Card>

          <Card className="glass-effect">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Client Satisfaction</CardTitle>
              <CheckCircle className="w-4 h-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-montserrat font-bold">{overallInsights.clientSatisfaction}/10</div>
              <p className="text-xs text-green-400 mt-1">Excellent rating</p>
            </CardContent>
          </Card>

          <Card className="glass-effect">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Risk Projects</CardTitle>
              <AlertTriangle className="w-4 h-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-montserrat font-bold">
                {overallInsights.riskDistribution.medium + overallInsights.riskDistribution.high}
              </div>
              <p className="text-xs text-muted-foreground mt-1">Require attention</p>
            </CardContent>
          </Card>
        </div>

        {/* Project Summaries */}
        <div className="space-y-6">
          {aiSummaries.map((summary, index) => (
            <Card
              key={summary.id}
              className="glass-effect animate-fade-in"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="font-montserrat flex items-center">
                      <Sparkles className="w-5 h-5 mr-2 text-pink-500" />
                      {summary.client} - {summary.projectName}
                    </CardTitle>
                    <CardDescription className="mt-1">Last updated {summary.lastUpdated}</CardDescription>
                  </div>
                  <Badge className={getRiskColor(summary.riskLevel)}>Risk: {summary.riskLevel}</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* AI Summary */}
                <div className="p-4 rounded-lg bg-gradient-to-r from-pink-500/10 to-purple-500/10 border border-pink-500/20">
                  <h4 className="font-semibold mb-2 flex items-center">
                    <Brain className="w-4 h-4 mr-2 text-pink-500" />
                    AI Summary
                  </h4>
                  <p className="text-sm text-muted-foreground">{summary.summary}</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Key Insights */}
                  <div>
                    <h4 className="font-semibold mb-3">Key Insights</h4>
                    <ul className="space-y-2">
                      {summary.insights.map((insight, idx) => (
                        <li key={idx} className="flex items-start space-x-2 text-sm">
                          <div className="w-1.5 h-1.5 rounded-full bg-pink-500 mt-2 flex-shrink-0"></div>
                          <span className="text-muted-foreground">{insight}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Next Actions */}
                  <div>
                    <h4 className="font-semibold mb-3">Recommended Actions</h4>
                    <ul className="space-y-2">
                      {summary.nextActions.map((action, idx) => (
                        <li key={idx} className="flex items-start space-x-2 text-sm">
                          <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                          <span className="text-muted-foreground">{action}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </DashboardLayout>
  )
}
