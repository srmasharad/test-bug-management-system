import { useState } from "react";

import { FileText } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  useBugsDiscoveredLastWeek,
  useBugsPerTester,
  useProjectsWithBugs,
  useTestExecutionsBySuite,
  useUnassignedBugs,
} from "../hooks/useQueries";

export default function ReportsTab() {
  const [report1Days, setReport1Days] = useState(7);
  const [report3Days, setReport3Days] = useState(7);

  const { data: report1Data = [] } = useTestExecutionsBySuite(report1Days);
  const { data: report2Data = [] } = useProjectsWithBugs();
  const { data: report3Data = [] } = useBugsPerTester(report3Days);
  const { data: report4Data = [] } = useBugsDiscoveredLastWeek();
  const { data: report5Data = [] } = useUnassignedBugs();

  const handleReport1DaysChange = (days: number) => {
    setReport1Days(days);
  };

  const handleReport3DaysChange = (days: number) => {
    setReport3Days(days);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Report 1: Test Executions by Suite
            </span>
            <Select
              value={report1Days.toString()}
              onValueChange={(value) =>
                handleReport1DaysChange(parseInt(value))
              }
            >
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">Last 1 Day</SelectItem>
                <SelectItem value="7">Last 7 Days</SelectItem>
                <SelectItem value="30">Last 30 Days</SelectItem>
              </SelectContent>
            </Select>
          </CardTitle>
          <CardDescription>
            Number of tests assigned for each test suite that have been run
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">Test Suite</th>
                  <th className="text-left p-2">Project</th>
                  <th className="text-right p-2">Total Test Cases</th>
                  <th className="text-right p-2">Total Executions</th>
                  <th className="text-right p-2">Recent Executions</th>
                </tr>
              </thead>
              <tbody>
                {report1Data.map((row: any, idx) => (
                  <tr key={idx} className="border-b hover:bg-gray-50">
                    <td className="p-2">{row.suite_name}</td>
                    <td className="p-2">{row.project_name}</td>
                    <td className="text-right p-2">{row.total_test_cases}</td>
                    <td className="text-right p-2">{row.total_executions}</td>
                    <td className="text-right p-2 font-semibold text-blue-600">
                      {row.recent_executions}
                    </td>
                  </tr>
                ))}
                {report1Data.length === 0 && (
                  <tr>
                    <td colSpan={5} className="text-center p-4 text-gray-500">
                      No data available
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Report 2: Projects with Bug Summary
          </CardTitle>
          <CardDescription>
            Summary of current projects under test with bug counts per
            sub-project
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">Project</th>
                  <th className="text-left p-2">Sub-Project</th>
                  <th className="text-right p-2">Total</th>
                  <th className="text-right p-2">Open</th>
                  <th className="text-right p-2">Closed</th>
                  <th className="text-right p-2">Critical</th>
                  <th className="text-right p-2">High</th>
                  <th className="text-right p-2">Medium</th>
                  <th className="text-right p-2">Low</th>
                </tr>
              </thead>
              <tbody>
                {report2Data.map((row: any, idx) => (
                  <tr key={idx} className="border-b hover:bg-gray-50">
                    <td className="p-2">{row.project_name}</td>
                    <td className="p-2">{row.sub_project_name || "-"}</td>
                    <td className="text-right p-2 font-semibold">
                      {row.total_bugs}
                    </td>
                    <td className="text-right p-2 text-yellow-600">
                      {row.open_bugs}
                    </td>
                    <td className="text-right p-2 text-green-600">
                      {row.closed_bugs}
                    </td>
                    <td className="text-right p-2 text-red-600">
                      {row.critical_bugs}
                    </td>
                    <td className="text-right p-2 text-orange-600">
                      {row.high_bugs}
                    </td>
                    <td className="text-right p-2 text-yellow-600">
                      {row.medium_bugs}
                    </td>
                    <td className="text-right p-2 text-green-600">
                      {row.low_bugs}
                    </td>
                  </tr>
                ))}
                {report2Data.length === 0 && (
                  <tr>
                    <td colSpan={9} className="text-center p-4 text-gray-500">
                      No data available
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Report 3: Bugs Assigned per Tester
            </span>
            <Select
              value={report3Days.toString()}
              onValueChange={(value) =>
                handleReport3DaysChange(parseInt(value))
              }
            >
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">Last 1 Day</SelectItem>
                <SelectItem value="7">Last 7 Days</SelectItem>
                <SelectItem value="30">Last 30 Days</SelectItem>
              </SelectContent>
            </Select>
          </CardTitle>
          <CardDescription>
            Number of bugs assigned to each tester during the specified period
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">Tester Name</th>
                  <th className="text-left p-2">Email</th>
                  <th className="text-right p-2">Assigned (Period)</th>
                  <th className="text-right p-2">Total Assigned</th>
                  <th className="text-right p-2">Resolved</th>
                </tr>
              </thead>
              <tbody>
                {report3Data.map((row: any, idx) => (
                  <tr key={idx} className="border-b hover:bg-gray-50">
                    <td className="p-2 font-medium">{row.tester_name}</td>
                    <td className="p-2 text-gray-600">{row.email}</td>
                    <td className="text-right p-2 font-semibold text-blue-600">
                      {row.bugs_assigned_period}
                    </td>
                    <td className="text-right p-2">
                      {row.total_bugs_assigned}
                    </td>
                    <td className="text-right p-2 text-green-600">
                      {row.bugs_resolved}
                    </td>
                  </tr>
                ))}
                {report3Data.length === 0 && (
                  <tr>
                    <td colSpan={5} className="text-center p-4 text-gray-500">
                      No data available
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Report 4: Bugs Discovered Last Week
          </CardTitle>
          <CardDescription>
            List of bugs discovered during the last 7 days with tester info and
            test case links
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {report4Data.map((bug: any, idx) => (
              <div key={idx} className="border rounded-lg p-3 hover:bg-gray-50">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h4 className="font-semibold">
                      #{bug.bug_id} - {bug.bug_name}
                    </h4>
                    {bug.description && (
                      <p className="text-sm text-gray-600 mt-1">
                        {bug.description}
                      </p>
                    )}
                    <div className="flex gap-2 mt-2 flex-wrap">
                      <span
                        className={`px-2 py-0.5 rounded text-xs ${
                          bug.status === "Open" || bug.status === "New"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {bug.status}
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded text-xs ${
                          bug.severity === "Critical"
                            ? "bg-red-100 text-red-800"
                            : bug.severity === "High"
                            ? "bg-orange-100 text-orange-800"
                            : bug.severity === "Medium"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-green-100 text-green-800"
                        }`}
                      >
                        {bug.severity}
                      </span>
                      <span className="px-2 py-0.5 rounded text-xs bg-blue-100 text-blue-800">
                        {bug.priority}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-3 text-xs text-gray-600">
                  <div>
                    <span className="font-medium">Discovered By:</span>{" "}
                    {bug.discovered_by_name}
                  </div>
                  <div>
                    <span className="font-medium">Email:</span>{" "}
                    {bug.tester_email}
                  </div>
                  {bug.test_case_name && (
                    <div>
                      <span className="font-medium">Test Case:</span>{" "}
                      {bug.test_case_name}
                    </div>
                  )}
                  <div>
                    <span className="font-medium">Project:</span>{" "}
                    {bug.project_name}
                  </div>
                  <div>
                    <span className="font-medium">Discovered:</span>{" "}
                    {new Date(bug.discovered_date).toLocaleDateString()}
                  </div>
                </div>
              </div>
            ))}
            {report4Data.length === 0 && (
              <p className="text-center text-gray-500 py-8">
                No bugs discovered in the last week
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Report 5: Unassigned Bugs
          </CardTitle>
          <CardDescription>
            List of bugs that are yet to be assigned to a tester
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {report5Data.map((bug: any, idx) => (
              <div
                key={idx}
                className={`border rounded-lg p-3 ${
                  bug.severity === "Critical"
                    ? "border-red-300 bg-red-50"
                    : bug.severity === "High"
                    ? "border-orange-300 bg-orange-50"
                    : bug.severity === "Medium"
                    ? "border-yellow-300 bg-yellow-50"
                    : "border-green-300 bg-green-50"
                }`}
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h4 className="font-semibold">
                      #{bug.bug_id} - {bug.name}
                    </h4>
                    {bug.description && (
                      <p className="text-sm text-gray-700 mt-1">
                        {bug.description}
                      </p>
                    )}
                    <div className="flex gap-2 mt-2 flex-wrap">
                      <span
                        className={`px-2 py-0.5 rounded text-xs font-medium ${
                          bug.severity === "Critical"
                            ? "bg-red-200 text-red-900"
                            : bug.severity === "High"
                            ? "bg-orange-200 text-orange-900"
                            : bug.severity === "Medium"
                            ? "bg-yellow-200 text-yellow-900"
                            : "bg-green-200 text-green-900"
                        }`}
                      >
                        {bug.severity}
                      </span>
                      <span className="px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                        {bug.priority}
                      </span>
                      <span className="px-2 py-0.5 rounded text-xs font-medium bg-gray-200 text-gray-800">
                        {bug.type}
                      </span>
                      <span className="px-2 py-0.5 rounded text-xs font-medium bg-purple-100 text-purple-800">
                        {bug.status}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-3 text-xs text-gray-700">
                  <div>
                    <span className="font-medium">Discovered By:</span>{" "}
                    {bug.discovered_by_name}
                  </div>
                  <div>
                    <span className="font-medium">Project:</span>{" "}
                    {bug.project_name}
                  </div>
                  {bug.sub_project_name && (
                    <div>
                      <span className="font-medium">Sub-Project:</span>{" "}
                      {bug.sub_project_name}
                    </div>
                  )}
                  {bug.environment && (
                    <div>
                      <span className="font-medium">Environment:</span>{" "}
                      {bug.environment}
                    </div>
                  )}
                  <div>
                    <span className="font-medium">Discovered:</span>{" "}
                    {new Date(bug.discovered_date).toLocaleDateString()}
                  </div>
                </div>
              </div>
            ))}
            {report5Data.length === 0 && (
              <p className="text-center text-gray-500 py-8">
                All bugs are assigned
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
