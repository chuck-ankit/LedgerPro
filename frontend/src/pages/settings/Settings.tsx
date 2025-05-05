import React, { useState } from 'react';
import { Save, Building2, User, Mail, Phone, MapPin } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';

const Settings: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setIsLoading(false);
  };
  
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600">Manage your business profile and preferences</p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Business Profile */}
        <div className="lg:col-span-2">
          <Card>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Business Profile</h2>
                
                <div className="space-y-4">
                  <Input
                    label="Business Name"
                    type="text"
                    id="businessName"
                    leftIcon={<Building2 className="h-5 w-5" />}
                    defaultValue="Acme Corporation"
                    required
                  />
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      label="Contact Person"
                      type="text"
                      id="contactPerson"
                      leftIcon={<User className="h-5 w-5" />}
                      defaultValue="John Smith"
                      required
                    />
                    
                    <Input
                      label="Email Address"
                      type="email"
                      id="email"
                      leftIcon={<Mail className="h-5 w-5" />}
                      defaultValue="contact@acmecorp.com"
                      required
                    />
                  </div>
                  
                  <Input
                    label="Phone Number"
                    type="tel"
                    id="phone"
                    leftIcon={<Phone className="h-5 w-5" />}
                    defaultValue="+91 98765 43210"
                    required
                  />
                  
                  <Input
                    label="Business Address"
                    type="text"
                    id="address"
                    leftIcon={<MapPin className="h-5 w-5" />}
                    defaultValue="123 Business Park, Phase 2, Mumbai, Maharashtra 400001"
                    required
                  />
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Tax Information</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="GSTIN"
                    type="text"
                    id="gstin"
                    defaultValue="27AADCB2230M1Z3"
                    required
                  />
                  
                  <Input
                    label="PAN"
                    type="text"
                    id="pan"
                    defaultValue="AADCB2230M"
                    required
                  />
                </div>
              </div>
              
              <div className="pt-4 border-t border-gray-200">
                <Button
                  type="submit"
                  leftIcon={<Save className="h-4 w-4" />}
                  isLoading={isLoading}
                  loadingText="Saving changes..."
                >
                  Save Changes
                </Button>
              </div>
            </form>
          </Card>
        </div>
        
        {/* Preferences */}
        <div>
          <Card>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Preferences</h2>
            
            <div className="space-y-4">
              <div>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    className="h-4 w-4 text-primary-600 border-gray-300 rounded"
                    defaultChecked
                  />
                  <span className="ml-2 text-sm text-gray-700">
                    Email notifications for new invoices
                  </span>
                </label>
              </div>
              
              <div>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    className="h-4 w-4 text-primary-600 border-gray-300 rounded"
                    defaultChecked
                  />
                  <span className="ml-2 text-sm text-gray-700">
                    Payment reminders for overdue invoices
                  </span>
                </label>
              </div>
              
              <div>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    className="h-4 w-4 text-primary-600 border-gray-300 rounded"
                    defaultChecked
                  />
                  <span className="ml-2 text-sm text-gray-700">
                    Monthly summary reports
                  </span>
                </label>
              </div>
              
              <div className="pt-4 border-t border-gray-200">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Default Currency
                </label>
                <select className="input w-full">
                  <option value="INR">Indian Rupee (₹)</option>
                  <option value="USD">US Dollar ($)</option>
                  <option value="EUR">Euro (€)</option>
                  <option value="GBP">British Pound (£)</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Date Format
                </label>
                <select className="input w-full">
                  <option value="dd/mm/yyyy">DD/MM/YYYY</option>
                  <option value="mm/dd/yyyy">MM/DD/YYYY</option>
                  <option value="yyyy-mm-dd">YYYY-MM-DD</option>
                </select>
              </div>
            </div>
          </Card>
          
          <div className="mt-6">
            <Card>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Danger Zone</h2>
              
              <div className="space-y-4">
                <Button
                  variant="outline"
                  className="w-full text-error-600 border-error-200 hover:bg-error-50"
                  onClick={() => {}}
                >
                  Delete Account
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;