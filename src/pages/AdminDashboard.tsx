import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CircleAlert as AlertCircle, Plus, CreditCard as Edit2, Trash2, LogOut, Users, Calendar, BookOpen } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { supabase } from "@/lib/supabase";

interface Class {
  id: string;
  name: string;
  day_of_week: string;
  start_time: string;
  end_time: string;
  max_capacity: number;
  current_capacity: number;
}

interface UserProfile {
  id: string;
  full_name: string;
  email: string;
  role: string;
  level: string;
}

interface AdminConfig {
  bank_name: string;
  account_type: string;
  account_number: string;
  rut: string;
  holder_name: string;
  whatsapp_number: string;
  email: string;
}

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [classes, setClasses] = useState<Class[]>([]);
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [adminConfig, setAdminConfig] = useState<AdminConfig | null>(null);
  const [newClass, setNewClass] = useState({
    name: "",
    day_of_week: "Lun",
    start_time: "18:00",
    end_time: "19:00",
    max_capacity: 20,
  });
  const [editingClass, setEditingClass] = useState<Class | null>(null);
  const [bankFormData, setBankFormData] = useState<AdminConfig>({
    bank_name: "Mercado Pago",
    account_type: "Cuenta Vista",
    account_number: "1046686070",
    rut: "201859271",
    holder_name: "Philip Jorge Alexander Vega Mercado",
    whatsapp_number: "",
    email: "philipvegga@gmail.com",
  });

  useEffect(() => {
    const checkAdminAndFetchData = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          navigate("/login");
          return;
        }

        const { data: profile } = await supabase
          .from("user_profiles")
          .select("*")
          .eq("id", user.id)
          .maybeSingle();

        if (profile?.role !== "admin") {
          navigate("/dashboard");
          return;
        }

        setIsAdmin(true);

        // Fetch classes
        const { data: classesData } = await supabase
          .from("classes")
          .select("*");
        if (classesData) setClasses(classesData);

        // Fetch users
        const { data: usersData } = await supabase
          .from("user_profiles")
          .select("*");
        if (usersData) setUsers(usersData);

        // Fetch admin config
        const { data: configData } = await supabase
          .from("admin_config")
          .select("*")
          .limit(1)
          .maybeSingle();

        if (configData) {
          setAdminConfig(configData);
          setBankFormData(configData);
        }
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setLoading(false);
      }
    };

    checkAdminAndFetchData();
  }, [navigate]);

  const handleAddClass = async () => {
    try {
      const { data, error } = await supabase
        .from("classes")
        .insert([newClass])
        .select();

      if (error) throw error;

      if (data) {
        setClasses([...classes, data[0]]);
        setNewClass({
          name: "",
          day_of_week: "Lun",
          start_time: "18:00",
          end_time: "19:00",
          max_capacity: 20,
        });
      }
    } catch (error) {
      console.error("Error adding class:", error);
    }
  };

  const handleUpdateClass = async () => {
    if (!editingClass) return;

    try {
      const { error } = await supabase
        .from("classes")
        .update({
          name: editingClass.name,
          day_of_week: editingClass.day_of_week,
          start_time: editingClass.start_time,
          end_time: editingClass.end_time,
          max_capacity: editingClass.max_capacity,
        })
        .eq("id", editingClass.id);

      if (error) throw error;

      setClasses(classes.map(c => c.id === editingClass.id ? editingClass : c));
      setEditingClass(null);
    } catch (error) {
      console.error("Error updating class:", error);
    }
  };

  const handleDeleteClass = async (id: string) => {
    try {
      const { error } = await supabase
        .from("classes")
        .delete()
        .eq("id", id);

      if (error) throw error;
      setClasses(classes.filter(c => c.id !== id));
    } catch (error) {
      console.error("Error deleting class:", error);
    }
  };

  const handleUpdateUserRole = async (userId: string, newRole: string) => {
    try {
      const { error } = await supabase
        .from("user_profiles")
        .update({ role: newRole })
        .eq("id", userId);

      if (error) throw error;

      setUsers(users.map(u => u.id === userId ? { ...u, role: newRole } : u));
    } catch (error) {
      console.error("Error updating user role:", error);
    }
  };

  const handleSaveBankConfig = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      if (adminConfig) {
        const { error } = await supabase
          .from("admin_config")
          .update(bankFormData)
          .eq("admin_id", user.id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("admin_config")
          .insert({
            admin_id: user.id,
            ...bankFormData,
          });

        if (error) throw error;
      }

      setAdminConfig(bankFormData);
    } catch (error) {
      console.error("Error saving bank config:", error);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  if (loading) {
    return <div className="min-h-screen bg-background flex items-center justify-center">Cargando...</div>;
  }

  if (!isAdmin) return null;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/30 glass sticky top-0 z-40">
        <div className="container mx-auto px-4 h-14 flex items-center justify-between">
          <h1 className="font-heading text-lg font-bold">Panel Admin</h1>
          <Button variant="ghost" size="icon" className="w-8 h-8" onClick={handleLogout}>
            <LogOut className="w-4 h-4" />
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 max-w-6xl">
        <Tabs defaultValue="classes" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="classes" className="gap-2">
              <Calendar className="w-4 h-4" />
              Clases
            </TabsTrigger>
            <TabsTrigger value="users" className="gap-2">
              <Users className="w-4 h-4" />
              Usuarios
            </TabsTrigger>
            <TabsTrigger value="config" className="gap-2">
              <BookOpen className="w-4 h-4" />
              Configuración
            </TabsTrigger>
          </TabsList>

          {/* Classes Tab */}
          <TabsContent value="classes" className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="card-fifa rounded-xl p-6 fifa-pattern space-y-4"
            >
              <h2 className="font-heading text-xl font-bold relative z-10">Agregar Nueva Clase</h2>

              <div className="grid md:grid-cols-2 gap-4 relative z-10">
                <div>
                  <Label className="text-sm">Nombre</Label>
                  <Input
                    value={newClass.name}
                    onChange={(e) => setNewClass({ ...newClass, name: e.target.value })}
                    placeholder="Ej: Calistenia Principiante"
                  />
                </div>
                <div>
                  <Label className="text-sm">Día</Label>
                  <select
                    value={newClass.day_of_week}
                    onChange={(e) => setNewClass({ ...newClass, day_of_week: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-secondary border border-border"
                  >
                    {['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'].map(day => (
                      <option key={day} value={day}>{day}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <Label className="text-sm">Hora Inicio</Label>
                  <Input
                    type="time"
                    value={newClass.start_time}
                    onChange={(e) => setNewClass({ ...newClass, start_time: e.target.value })}
                  />
                </div>
                <div>
                  <Label className="text-sm">Hora Fin</Label>
                  <Input
                    type="time"
                    value={newClass.end_time}
                    onChange={(e) => setNewClass({ ...newClass, end_time: e.target.value })}
                  />
                </div>
                <div>
                  <Label className="text-sm">Capacidad Máxima</Label>
                  <Input
                    type="number"
                    value={newClass.max_capacity}
                    onChange={(e) => setNewClass({ ...newClass, max_capacity: parseInt(e.target.value) })}
                  />
                </div>
              </div>

              <Button onClick={handleAddClass} variant="default" className="gradient-cyan text-primary-foreground relative z-10 w-full">
                <Plus className="w-4 h-4 mr-2" />
                Agregar Clase
              </Button>
            </motion.div>

            {/* Classes List */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="space-y-3"
            >
              {classes.map((cls) => (
                <div key={cls.id} className="card-fifa rounded-xl p-4 fifa-pattern flex items-center justify-between relative z-10">
                  <div className="flex-1">
                    <p className="font-heading font-bold">{cls.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {cls.day_of_week} · {cls.start_time}-{cls.end_time} · {cls.current_capacity}/{cls.max_capacity}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setEditingClass(cls)}
                    >
                      <Edit2 className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDeleteClass(cls.id)}
                      className="text-destructive"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </motion.div>

            {/* Edit Class Modal */}
            {editingClass && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="card-fifa rounded-xl p-6 fifa-pattern space-y-4 relative z-10"
              >
                <h3 className="font-heading text-lg font-bold">Editar Clase</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <Input
                    value={editingClass.name}
                    onChange={(e) => setEditingClass({ ...editingClass, name: e.target.value })}
                    placeholder="Nombre"
                  />
                  <select
                    value={editingClass.day_of_week}
                    onChange={(e) => setEditingClass({ ...editingClass, day_of_week: e.target.value })}
                    className="px-3 py-2 rounded-lg bg-secondary border border-border"
                  >
                    {['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'].map(day => (
                      <option key={day} value={day}>{day}</option>
                    ))}
                  </select>
                  <Input
                    type="time"
                    value={editingClass.start_time}
                    onChange={(e) => setEditingClass({ ...editingClass, start_time: e.target.value })}
                  />
                  <Input
                    type="time"
                    value={editingClass.end_time}
                    onChange={(e) => setEditingClass({ ...editingClass, end_time: e.target.value })}
                  />
                </div>
                <div className="flex gap-3">
                  <Button onClick={handleUpdateClass} className="gradient-cyan text-primary-foreground flex-1">
                    Guardar
                  </Button>
                  <Button onClick={() => setEditingClass(null)} variant="outline" className="flex-1">
                    Cancelar
                  </Button>
                </div>
              </motion.div>
            )}
          </TabsContent>

          {/* Users Tab */}
          <TabsContent value="users" className="space-y-4">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left p-3 font-heading">Nombre</th>
                    <th className="text-left p-3 font-heading">Email</th>
                    <th className="text-left p-3 font-heading">Rol</th>
                    <th className="text-left p-3 font-heading">Nivel</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.id} className="border-b border-border/30 hover:bg-secondary/30 transition">
                      <td className="p-3">{user.full_name}</td>
                      <td className="p-3 text-xs text-muted-foreground font-mono">{user.email}</td>
                      <td className="p-3">
                        <select
                          value={user.role}
                          onChange={(e) => handleUpdateUserRole(user.id, e.target.value)}
                          className="px-2 py-1 rounded bg-secondary border border-border text-xs"
                        >
                          <option value="alumno">Alumno</option>
                          <option value="coach">Coach</option>
                          <option value="admin">Admin</option>
                        </select>
                      </td>
                      <td className="p-3">
                        <span className="px-2 py-1 rounded bg-primary/10 text-primary text-xs font-semibold">
                          {user.level}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </TabsContent>

          {/* Config Tab */}
          <TabsContent value="config" className="space-y-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="card-fifa rounded-xl p-6 fifa-pattern space-y-6 relative z-10"
            >
              <h2 className="font-heading text-xl font-bold">Configuración Bancaria</h2>

              <Alert className="border-primary/50 bg-primary/10">
                <AlertCircle className="h-4 w-4 text-primary" />
                <AlertDescription className="text-foreground">
                  Datos de transferencia que se mostrarán a los alumnos
                </AlertDescription>
              </Alert>

              <div className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm">Banco</Label>
                    <Input
                      value={bankFormData.bank_name}
                      onChange={(e) => setBankFormData({ ...bankFormData, bank_name: e.target.value })}
                      className="bg-secondary"
                    />
                  </div>
                  <div>
                    <Label className="text-sm">Tipo de Cuenta</Label>
                    <Input
                      value={bankFormData.account_type}
                      onChange={(e) => setBankFormData({ ...bankFormData, account_type: e.target.value })}
                      className="bg-secondary"
                    />
                  </div>
                  <div>
                    <Label className="text-sm">Número de Cuenta</Label>
                    <Input
                      value={bankFormData.account_number}
                      onChange={(e) => setBankFormData({ ...bankFormData, account_number: e.target.value })}
                      className="bg-secondary"
                    />
                  </div>
                  <div>
                    <Label className="text-sm">RUT</Label>
                    <Input
                      value={bankFormData.rut}
                      onChange={(e) => setBankFormData({ ...bankFormData, rut: e.target.value })}
                      className="bg-secondary"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <Label className="text-sm">Nombre del Titular</Label>
                    <Input
                      value={bankFormData.holder_name}
                      onChange={(e) => setBankFormData({ ...bankFormData, holder_name: e.target.value })}
                      className="bg-secondary"
                    />
                  </div>
                  <div>
                    <Label className="text-sm">WhatsApp</Label>
                    <Input
                      value={bankFormData.whatsapp_number}
                      onChange={(e) => setBankFormData({ ...bankFormData, whatsapp_number: e.target.value })}
                      placeholder="+56912345678"
                      className="bg-secondary"
                    />
                  </div>
                  <div>
                    <Label className="text-sm">Email</Label>
                    <Input
                      value={bankFormData.email}
                      onChange={(e) => setBankFormData({ ...bankFormData, email: e.target.value })}
                      className="bg-secondary"
                    />
                  </div>
                </div>

                <Button onClick={handleSaveBankConfig} className="gradient-cyan text-primary-foreground w-full">
                  Guardar Configuración
                </Button>
              </div>
            </motion.div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default AdminDashboard;
