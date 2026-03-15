export type sideBarProps = {
    sidebarOpen: boolean;
    setSidebarOpen: (open: boolean) => void;
    activeNav: string;
    setActiveNav: (nav: string) => void;
    STATS: any[];
    showWizard: boolean;
    setShowWizard: (show: boolean) => void;
    search: string;
    setSearch: (search: string) => void;
    filtered: any[];
    STATUS_CONFIG: any;
    TYPE_ICONS: any;
}