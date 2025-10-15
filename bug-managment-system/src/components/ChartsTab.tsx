import {
  useCallback,
  useEffect,
  useState,
} from 'react';

import {
  BarChart3,
  PieChart as PieChartIcon,
  TrendingUp,
} from 'lucide-react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import api from '../lib/api';

const COLORS = [
  "#3b82f6",
  "#10b981",
  "#f59e0b",
  "#ef4444",
  "#8b5cf6",
  "#ec4899",
  "#14b8a6",
];

export default function ChartsTab() {
  const [openIssuesData, setOpenIssuesData] = useState([]);
  const [closedIssuesData, setClosedIssuesData] = useState([]);
  const [statusDistData, setStatusDistData] = useState([]);
  const [severityDistData, setSeverityDistData] = useState([]);
  const [openPeriod, setOpenPeriod] = useState(30);
  const [closedPeriod, setClosedPeriod] = useState(30);
  const [loading, setLoading] = useState(false);

  const loadAllCharts = useCallback(async () => {
    setLoading(true);
    try {
      await Promise.all([
        loadOpenIssues(openPeriod),
        loadClosedIssues(closedPeriod),
        loadStatusDistribution(),
        loadSeverityDistribution(),
      ]);
    } catch (error) {
      console.error("Error loading charts:", error);
    } finally {
      setLoading(false);
    }
  }, [closedPeriod, openPeriod]);

  useEffect(() => {
    loadAllCharts();
  }, [loadAllCharts]);

  const loadOpenIssues = async (days: number) => {
    const data = await api.getOpenIssuesByProject(days);

    const aggregated = data.reduce((acc: any, row: any) => {
      const existing = acc.find(
        (item: any) => item.project_name === row.project_name
      );
      if (existing) {
        existing.count += row.open_issues;
      } else {
        acc.push({ project_name: row.project_name, count: row.open_issues });
      }
      return acc;
    }, []);

    setOpenIssuesData(aggregated);
  };

  const loadClosedIssues = async (days: number) => {
    const data = await api.getClosedIssuesByProject(days);

    const aggregated = data.reduce((acc: any, row: any) => {
      const existing = acc.find(
        (item: any) => item.project_name === row.project_name
      );
      if (existing) {
        existing.count += row.closed_issues;
      } else {
        acc.push({ project_name: row.project_name, count: row.closed_issues });
      }
      return acc;
    }, []);

    setClosedIssuesData(aggregated);
  };

  const loadStatusDistribution = async () => {
    const data = await api.getBugStatusDistribution();
    setSeverityDistData(data);
  };

  const loadSeverityDistribution = async () => {
    const data = await api.getBugSeverityDistribution();
    setStatusDistData(data);
  };

  const handleOpenPeriodChange = async (days: number) => {
    setOpenPeriod(days);
    await loadOpenIssues(days);
  };

  const handleClosedPeriodChange = async (days: number) => {
    setClosedPeriod(days);
    await loadClosedIssues(days);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Open Issues per Project
            </span>
            <Select
              value={openPeriod.toString()}
              onValueChange={(value) => handleOpenPeriodChange(parseInt(value))}
            >
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7">Last 7 Days</SelectItem>
                <SelectItem value="14">Last 14 Days</SelectItem>
                <SelectItem value="30">Last 30 Days</SelectItem>
              </SelectContent>
            </Select>
          </CardTitle>
          <CardDescription>
            Number of open issues per each project during the selected period
          </CardDescription>
        </CardHeader>
        <CardContent>
          {openIssuesData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={openIssuesData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="project_name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="count" fill="#ef4444" name="Open Issues" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-center text-gray-500 py-8">
              No data available for the selected period
            </p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Closed Issues per Project
            </span>
            <Select
              value={closedPeriod.toString()}
              onValueChange={(value) =>
                handleClosedPeriodChange(parseInt(value))
              }
            >
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7">Last 7 Days</SelectItem>
                <SelectItem value="14">Last 14 Days</SelectItem>
                <SelectItem value="30">Last 30 Days</SelectItem>
              </SelectContent>
            </Select>
          </CardTitle>
          <CardDescription>
            Number of closed issues per each project during the selected period
          </CardDescription>
        </CardHeader>
        <CardContent>
          {closedIssuesData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={closedIssuesData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="project_name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="count" fill="#10b981" name="Closed Issues" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-center text-gray-500 py-8">
              No data available for the selected period
            </p>
          )}
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChartIcon className="h-5 w-5" />
              Bug Severity Distribution
            </CardTitle>
            <CardDescription>
              Distribution of bugs by severity level
            </CardDescription>
          </CardHeader>
          <CardContent>
            {statusDistData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={statusDistData}
                    dataKey="count"
                    nameKey="severity"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    label={(entry) => `${entry.severity}: ${entry.count}`}
                  >
                    {statusDistData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-center text-gray-500 py-8">
                No data available
              </p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Bug Status Distribution
            </CardTitle>
            <CardDescription>Distribution of bugs by status</CardDescription>
          </CardHeader>
          <CardContent>
            {severityDistData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={severityDistData}
                    dataKey="count"
                    nameKey="status"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    label={(entry) => `${entry.status}: ${entry.count}`}
                  >
                    {severityDistData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-center text-gray-500 py-8">
                No data available
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
