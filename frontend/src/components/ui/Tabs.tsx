import React, { useState } from 'react';
import { motion } from 'framer-motion';

interface Tab {
  id: string;
  label: string;
  icon?: React.ReactNode;
}

interface TabsProps {
  tabs: Tab[];
  defaultTab?: string;
  onChange?: (tabId: string) => void;
  children: React.ReactNode;
}

export const Tabs: React.FC<TabsProps> = ({
  tabs,
  defaultTab = tabs[0]?.id || '',
  onChange,
  children,
}) => {
  const [active, setActive] = useState(defaultTab);

  const handleTabClick = (tabId: string) => {
    setActive(tabId);
    onChange?.(tabId);
  };

  return (
    <div>
      {/* Tab Buttons */}
      <div className="flex gap-2 border-b border-gray-200 mb-6 flex-wrap">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => handleTabClick(tab.id)}
            className={`
              flex items-center px-4 py-2 font-semibold text-sm transition-colors
              ${
                active === tab.id
                  ? 'text-primary border-b-2 border-primary'
                  : 'text-gray-600 hover:text-gray-900'
              }
            `}
          >
            {tab.icon && <span className="mr-2">{tab.icon}</span>}
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <motion.div
        key={active}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        {children}
      </motion.div>
    </div>
  );
};
