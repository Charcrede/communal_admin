import { useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff } from "lucide-react";
import { toast } from "sonner"; // import du toast

export default function ChangePasswordForm({ onSubmit }: { onSubmit: (data: { currentPassword: string, newPassword: string }) => void }) {
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (passwordData.newPassword !== passwordData.confirmNewPassword) {
      return toast.error("Le nouveau mot de passe et la confirmation ne correspondent pas");
    }

    setIsLoading(true);
    try {
      await onSubmit({ currentPassword: passwordData.currentPassword, newPassword: passwordData.newPassword });
      setPasswordData({ currentPassword: "", newPassword: "", confirmNewPassword: "" });

      toast.success("Votre mot de passe a été modifié avec succès !");
    } catch (err: any) {
      toast.error(err.message || "Une erreur est survenue");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="border-0 shadow-lg">
      <CardHeader>
        <CardTitle className="text-xl font-bold text-[#940806] font-sofia uppercase">
          Modifier votre mot de passe
        </CardTitle>
        <CardDescription>
          Changez votre mot de passe en toute sécurité
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label htmlFor="currentPassword" className="text-sm font-medium">Mot de passe actuel :</Label>
            <div className="relative mt-1">
              <Input
                id="currentPassword"
                type={showCurrent ? "text" : "password"}
                value={passwordData.currentPassword}
                onChange={(e) => setPasswordData(prev => ({ ...prev, currentPassword: e.target.value }))}
                placeholder="••••••••"
                className="pr-12 border-gray-200 focus:border-[#074020] focus:ring-[#074020]/20"
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => setShowCurrent(!showCurrent)}
                className="absolute inset-y-0 right-0 flex items-center pr-4 text-gray-400 hover:text-gray-600"
                disabled={isLoading}
              >
                {showCurrent ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div>
            <Label htmlFor="newPassword" className="text-sm font-medium">Nouveau mot de passe :</Label>
            <div className="relative mt-1">
              <Input
                id="newPassword"
                type={showNew ? "text" : "password"}
                value={passwordData.newPassword}
                onChange={(e) => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
                placeholder="••••••••"
                className="pr-12 border-gray-200 focus:border-[#074020] focus:ring-[#074020]/20"
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => setShowNew(!showNew)}
                className="absolute inset-y-0 right-0 flex items-center pr-4 text-gray-400 hover:text-gray-600"
                disabled={isLoading}
              >
                {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div>
            <Label htmlFor="confirmNewPassword" className="text-sm font-medium">Confirmer le nouveau mot de passe :</Label>
            <div className="relative mt-1">
              <Input
                id="confirmNewPassword"
                type={showConfirm ? "text" : "password"}
                value={passwordData.confirmNewPassword}
                onChange={(e) => setPasswordData(prev => ({ ...prev, confirmNewPassword: e.target.value }))}
                placeholder="••••••••"
                className="pr-12 border-gray-200 focus:border-[#074020] focus:ring-[#074020]/20"
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                className="absolute inset-y-0 right-0 flex items-center pr-4 text-gray-400 hover:text-gray-600"
                disabled={isLoading}
              >
                {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <Button
              type="submit"
              className="bg-[#074020] hover:bg-[#074020]/90 text-white font-bold uppercase"
              disabled={isLoading}
            >
              {isLoading ? "Modification..." : "Modifier le mot de passe"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
