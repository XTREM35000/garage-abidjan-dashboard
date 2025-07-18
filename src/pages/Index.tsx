import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { 
  Car, 
  Users, 
  Wrench, 
  BarChart3, 
  Shield, 
  Smartphone, 
  Bell, 
  FileText, 
  Settings, 
  CheckCircle, 
  Phone, 
  Mail, 
  MapPin,
  Crown,
  Zap
} from "lucide-react";

const Index = () => {
  const coreFeatures = [
    { icon: Users, title: "Gestion des clients", description: "Base de données complète des clients" },
    { icon: Car, title: "Gestion des véhicules", description: "Suivi des véhicules et leurs spécifications" },
    { icon: Wrench, title: "Gestion des réparations", description: "Suivi complet des interventions" },
    { icon: BarChart3, title: "Tableau de bord", description: "Vue d'ensemble de l'activité" },
    { icon: Shield, title: "Authentification", description: "Accès sécurisé à l'application" },
    { icon: Smartphone, title: "Application responsive", description: "Accessible sur tous les appareils" }
  ];

  const optionalModules = [
    { icon: Bell, title: "Notifications visuelles", price: "20 000 FCFA", color: "bg-blue-500" },
    { icon: Smartphone, title: "SMS client", price: "40 000 FCFA", color: "bg-green-500" },
    { icon: BarChart3, title: "Dashboard statistiques", price: "30 000 FCFA", color: "bg-purple-500" },
    { icon: Users, title: "Multi-utilisateur", price: "50 000 FCFA", color: "bg-orange-500" },
    { icon: FileText, title: "Factures téléchargeables", price: "35 000 FCFA", color: "bg-red-500" },
    { icon: Settings, title: "Interface personnalisable", price: "60 000 FCFA", color: "bg-indigo-500" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      {/* Header */}
      <header className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border-b sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Wrench className="h-8 w-8 text-primary" />
              <h1 className="text-2xl font-bold text-primary">GarageManager Pro</h1>
            </div>
            <Badge variant="secondary" className="text-sm">
              <Zap className="h-4 w-4 mr-1" />
              Livraison en 3 jours
            </Badge>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 space-y-12">
        {/* Hero Section */}
        <section className="text-center space-y-6">
          <Badge variant="outline" className="text-primary border-primary">
            <Crown className="h-4 w-4 mr-1" />
            Solution de gestion professionnelle
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold text-foreground">
            Application de Gestion de Garage
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Solution complète et moderne pour la gestion de votre garage à Abidjan. 
            Gérez vos clients, véhicules et réparations en toute simplicité.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <div className="flex items-center text-sm text-muted-foreground">
              <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
              Hébergement gratuit inclus
            </div>
            <div className="flex items-center text-sm text-muted-foreground">
              <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
              Base de données sécurisée
            </div>
            <div className="flex items-center text-sm text-muted-foreground">
              <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
              Support technique inclus
            </div>
          </div>
        </section>

        {/* Configuration initiale */}
        <section>
          <Card className="border-2 border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Settings className="h-5 w-5 mr-2 text-primary" />
                Configuration initiale du garage
              </CardTitle>
              <CardDescription>
                Une modale de configuration s'ouvre au premier lancement pour personnaliser votre application
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-sm">Nom du garage</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-sm">Nom du propriétaire</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-sm">Logo à uploader</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-sm">Informations de contact</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-sm">Email & Téléphone</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-sm">Couleur de thème</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Fonctionnalités principales */}
        <section>
          <div className="text-center mb-8">
            <h3 className="text-3xl font-bold mb-4">Fonctionnalités principales</h3>
            <p className="text-muted-foreground">Tout ce dont vous avez besoin pour gérer votre garage efficacement</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {coreFeatures.map((feature, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <feature.icon className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle className="text-lg">{feature.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Modules optionnels */}
        <section>
          <div className="text-center mb-8">
            <h3 className="text-3xl font-bold mb-4">Modules optionnels</h3>
            <p className="text-muted-foreground">Étendez les fonctionnalités selon vos besoins</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {optionalModules.map((module, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow border-2 hover:border-primary/30">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 ${module.color} rounded-lg`}>
                        <module.icon className="h-6 w-6 text-white" />
                      </div>
                      <CardTitle className="text-lg">{module.title}</CardTitle>
                    </div>
                    <Badge variant="secondary">{module.price}</Badge>
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>
        </section>

        {/* Tarification */}
        <section>
          <div className="text-center mb-8">
            <h3 className="text-3xl font-bold mb-4">Tarification transparente</h3>
            <p className="text-muted-foreground">Prix fixes, pas de surprises</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="border-2 border-primary">
              <CardHeader>
                <CardTitle className="text-2xl text-center">Application de base</CardTitle>
                <div className="text-center">
                  <span className="text-4xl font-bold text-primary">100 000</span>
                  <span className="text-lg text-muted-foreground ml-2">FCFA TTC</span>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    <span className="text-sm">Toutes les fonctionnalités principales</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    <span className="text-sm">Configuration personnalisée</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    <span className="text-sm">Hébergement gratuit à vie</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    <span className="text-sm">Support technique 3 mois</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Coûts additionnels</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span>Modules optionnels</span>
                    <span className="font-medium">20 000 - 60 000 FCFA</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Nom de domaine pro (optionnel)</span>
                    <span className="font-medium">~10 000 FCFA/an</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Commission Stripe</span>
                    <span className="font-medium">2.9% + 30 FCFA/transaction</span>
                  </div>
                </div>
                <Separator />
                <div className="text-sm text-muted-foreground">
                  * Hébergement et base de données gratuits grâce à Vercel et Supabase
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Stack technique */}
        <section>
          <Card>
            <CardHeader>
              <CardTitle className="text-center">Stack technique moderne et fiable</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
                <div>
                  <div className="text-2xl font-bold text-blue-600 mb-2">ReactJS</div>
                  <div className="text-sm text-muted-foreground">Interface utilisateur</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-green-600 mb-2">Supabase</div>
                  <div className="text-sm text-muted-foreground">Base de données & Auth</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-black mb-2">Vercel</div>
                  <div className="text-sm text-muted-foreground">Hébergement</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-purple-600 mb-2">Stripe</div>
                  <div className="text-sm text-muted-foreground">Paiements</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Contact développeur */}
        <section>
          <Card className="bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">Votre développeur</CardTitle>
              <CardDescription>Expert en développement d'applications web modernes</CardDescription>
            </CardHeader>
            <CardContent className="text-center space-y-6">
              <div>
                <h4 className="text-xl font-bold text-primary mb-2">Thierry Gogo</h4>
                <p className="text-lg text-muted-foreground">Freelance FullStack Developer</p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <div className="flex items-center space-x-2">
                  <Phone className="h-4 w-4 text-primary" />
                  <span className="font-medium">0758966156</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Mail className="h-4 w-4 text-primary" />
                  <span className="font-medium">2024dibo@gmail.com</span>
                </div>
                <div className="flex items-center space-x-2">
                  <MapPin className="h-4 w-4 text-primary" />
                  <span className="font-medium">Abidjan, Côte d'Ivoire</span>
                </div>
              </div>

              <div className="pt-4">
                <Button size="lg" className="text-lg px-8">
                  <Phone className="h-5 w-5 mr-2" />
                  Démarrer votre projet
                </Button>
              </div>

              <div className="text-sm text-muted-foreground">
                ✨ Livraison garantie en 3 jours maximum
              </div>
            </CardContent>
          </Card>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-8 mt-16">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Wrench className="h-6 w-6" />
            <span className="text-xl font-bold">GarageManager Pro</span>
          </div>
          <p className="text-slate-400 mb-2">
            Développé par <span className="font-medium text-white">Thierry Gogo</span> - Freelance FullStack Developer
          </p>
          <p className="text-slate-500 text-sm">
            © 2024 - Solution professionnelle pour garages à Abidjan
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
