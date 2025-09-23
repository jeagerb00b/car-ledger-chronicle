import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AutomotiveButton } from '@/components/ui/automotive-button';
import { AutomotiveCard, AutomotiveCardContent, AutomotiveCardDescription, AutomotiveCardHeader, AutomotiveCardTitle } from '@/components/ui/automotive-card';
import { Shield, Eye, Car, Database } from 'lucide-react';

const RoleSelection = () => {
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState<'admin' | 'viewer' | null>(null);

  const handleRoleSelection = (role: 'admin' | 'viewer') => {
    setSelectedRole(role);
    // Add a small delay for the animation
    setTimeout(() => {
      navigate(role === 'admin' ? '/admin' : '/viewer');
    }, 200);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30">
      <div className="container mx-auto px-4 py-16">
        {/* Header Section */}
        <div className="text-center mb-16 animate-fade-in">
          <div className="flex justify-center mb-6">
            <div className="p-4 rounded-full bg-primary/10 border border-primary/20">
              <Database className="h-12 w-12 text-primary" />
            </div>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent mb-4">
            Car Database Management System
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Comprehensive tracking of used cars with owner history, crime records, and dealership information
          </p>
        </div>

        {/* Role Selection Cards */}
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-semibold text-center mb-8 animate-slide-up">
            Choose Your Access Level
          </h2>
          
          <div className="grid md:grid-cols-2 gap-8 animate-slide-up" style={{ animationDelay: '0.2s' }}>
            {/* Admin Role Card */}
            <AutomotiveCard 
              variant="interactive" 
              className={`transition-all duration-300 ${
                selectedRole === 'admin' ? 'ring-2 ring-primary scale-105' : ''
              }`}
              onClick={() => handleRoleSelection('admin')}
            >
              <AutomotiveCardHeader>
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 rounded-lg bg-primary/10 border border-primary/20">
                    <Shield className="h-8 w-8 text-primary" />
                  </div>
                  <AutomotiveCardTitle className="text-2xl">Administrator</AutomotiveCardTitle>
                </div>
                <AutomotiveCardDescription className="text-base">
                  Full access to manage the entire database system
                </AutomotiveCardDescription>
              </AutomotiveCardHeader>
              
              <AutomotiveCardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm">
                    <Car className="h-4 w-4 text-primary" />
                    <span>Add, edit, and delete car records</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Shield className="h-4 w-4 text-primary" />
                    <span>Manage owner information and history</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Database className="h-4 w-4 text-primary" />
                    <span>Track crime records and incidents</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Eye className="h-4 w-4 text-primary" />
                    <span>Monitor dealership activities</span>
                  </div>
                </div>
                
                <AutomotiveButton 
                  variant="admin" 
                  size="lg" 
                  className="w-full mt-6"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRoleSelection('admin');
                  }}
                >
                  <Shield className="h-5 w-5" />
                  Access Admin Dashboard
                </AutomotiveButton>
              </AutomotiveCardContent>
            </AutomotiveCard>

            {/* Viewer Role Card */}
            <AutomotiveCard 
              variant="interactive"
              className={`transition-all duration-300 ${
                selectedRole === 'viewer' ? 'ring-2 ring-automotive-accent scale-105' : ''
              }`}
              onClick={() => handleRoleSelection('viewer')}
            >
              <AutomotiveCardHeader>
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 rounded-lg bg-automotive-dark/10 border border-automotive-accent/20">
                    <Eye className="h-8 w-8 text-automotive-dark" />
                  </div>
                  <AutomotiveCardTitle className="text-2xl">Viewer</AutomotiveCardTitle>
                </div>
                <AutomotiveCardDescription className="text-base">
                  Browse and search car records with read-only access
                </AutomotiveCardDescription>
              </AutomotiveCardHeader>
              
              <AutomotiveCardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm">
                    <Car className="h-4 w-4 text-automotive-dark" />
                    <span>Browse comprehensive car catalog</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Eye className="h-4 w-4 text-automotive-dark" />
                    <span>View detailed car information</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Shield className="h-4 w-4 text-automotive-dark" />
                    <span>Access owner and crime history</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Database className="h-4 w-4 text-automotive-dark" />
                    <span>Search and filter functionality</span>
                  </div>
                </div>
                
                <AutomotiveButton 
                  variant="viewer" 
                  size="lg" 
                  className="w-full mt-6"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRoleSelection('viewer');
                  }}
                >
                  <Eye className="h-5 w-5" />
                  Browse Car Database
                </AutomotiveButton>
              </AutomotiveCardContent>
            </AutomotiveCard>
          </div>
        </div>

        {/* Features Section */}
        <div className="mt-20 animate-fade-in" style={{ animationDelay: '0.4s' }}>
          <div className="text-center mb-12">
            <h3 className="text-2xl font-semibold mb-4">System Features</h3>
            <p className="text-muted-foreground">Comprehensive database management for automotive records</p>
          </div>
          
          <div className="grid md:grid-cols-4 gap-6 max-w-5xl mx-auto">
            <div className="text-center">
              <Car className="h-12 w-12 text-primary mx-auto mb-3" />
              <h4 className="font-semibold mb-2">Vehicle Tracking</h4>
              <p className="text-sm text-muted-foreground">Complete car registration and ownership records</p>
            </div>
            <div className="text-center">
              <Shield className="h-12 w-12 text-primary mx-auto mb-3" />
              <h4 className="font-semibold mb-2">Crime History</h4>
              <p className="text-sm text-muted-foreground">Track criminal activities associated with vehicles</p>
            </div>
            <div className="text-center">
              <Eye className="h-12 w-12 text-primary mx-auto mb-3" />
              <h4 className="font-semibold mb-2">Owner Records</h4>
              <p className="text-sm text-muted-foreground">Detailed owner information and transfer history</p>
            </div>
            <div className="text-center">
              <Database className="h-12 w-12 text-primary mx-auto mb-3" />
              <h4 className="font-semibold mb-2">Dealership Network</h4>
              <p className="text-sm text-muted-foreground">Manage dealership relationships and transactions</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoleSelection;