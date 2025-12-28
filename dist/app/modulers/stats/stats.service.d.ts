export declare const StatsService: {
    getBookingStats: () => Promise<{
        totalBooking: number;
        totalBookingByStatus: any[];
        bookingsPerTour: any[];
        avgGuestCountPerBooking: any;
        bookingsLast7Days: number;
        bookingsLast30Days: number;
        totalBookingByUniqueUsers: any[];
    }>;
    getPaymentStats: () => Promise<{
        totalPayment: number;
        totalPaymentByStatus: any[];
        totalRevenue: any[];
        avgPaymentAmount: any[];
        paymentGatewayData: any[];
    }>;
    getTourStats: () => Promise<{
        totalTour: number;
        totalTourByTourType: any[];
        avgTourCost: any[];
        totalTourByDivision: any[];
        totalHighestBookedTour: any[];
    }>;
    getUserStats: () => Promise<{
        totalUsers: number;
        totalActiveUsers: number;
        totalInActiveUsers: number;
        totalBlockedUsers: number;
        newUsersInLast7Days: number;
        newUsersInLast30Days: number;
        usersByRole: any[];
    }>;
};
//# sourceMappingURL=stats.service.d.ts.map