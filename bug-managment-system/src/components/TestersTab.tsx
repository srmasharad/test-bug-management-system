import { useState } from "react";

import { Loader2, Mail, Plus, Users } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { type Tester } from "@/lib/api";

import { useCreateTester, useTesters } from "../hooks/useQueries";

export default function TestersTab() {
  const { data: testers = [], isLoading } = useTesters();
  const createTester = useCreateTester();

  const [formData, setFormData] = useState<Tester>({
    name: "",
    email: "",
    role: "",
    date_joined: new Date().toISOString().split("T")[0],
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    createTester.mutate(formData, {
      onSuccess: () => {
        setFormData({
          name: "",
          email: "",
          role: "",
          date_joined: new Date().toISOString().split("T")[0],
        });
      },
    });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Add Tester
          </CardTitle>
          <CardDescription>Register a new tester in the system</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="name">Tester Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                required
              />
            </div>
            <div>
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                required
              />
            </div>
            <div>
              <Label htmlFor="role">Role</Label>
              <Input
                id="role"
                value={formData.role}
                onChange={(e) =>
                  setFormData({ ...formData, role: e.target.value })
                }
                placeholder="e.g., QA Engineer, Test Lead"
              />
            </div>
            <div>
              <Label htmlFor="date_joined">Date Joined *</Label>
              <Input
                id="date_joined"
                type="date"
                value={formData.date_joined}
                onChange={(e) =>
                  setFormData({ ...formData, date_joined: e.target.value })
                }
                required
              />
            </div>
            <Button
              type="submit"
              className="w-full"
              disabled={createTester.isPending}
            >
              {createTester.isPending && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              {createTester.isPending ? "Adding..." : "Add Tester"}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            All Testers
          </CardTitle>
          <CardDescription>View all registered testers</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-gray-500" />
              <span className="ml-2 text-gray-500">Loading testers...</span>
            </div>
          ) : (
            <div className="space-y-3">
              {testers.map((tester: Tester) => (
                <div
                  key={tester.tester_id}
                  className="border rounded-lg p-4 bg-white"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold">{tester.name}</h3>
                      <p className="text-sm text-gray-600 flex items-center gap-1 mt-1">
                        <Mail className="h-3 w-3" />
                        {tester.email}
                      </p>
                      {tester.role && (
                        <p className="text-sm text-gray-500 mt-1">
                          {tester.role}
                        </p>
                      )}
                    </div>
                    <div className="text-xs text-gray-500">
                      Joined: {tester.date_joined}
                    </div>
                  </div>
                </div>
              ))}
              {testers.length === 0 && (
                <p className="text-center text-gray-500 py-8">
                  No testers yet. Add your first tester!
                </p>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
