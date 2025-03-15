export interface UserStats {
    totalUsers: number;
    totalAdmins: number;
    allAccounts: number;
    roleDistribution: Array<{ _id: string; count: number }>;
    creationStats: Array<{ date: string; count: number }>; 
    growthPercentage: number; 
  }

export interface QuizStats {
  totalQuizzes: number;
  creationStats: Array<{
    date: string;
    count: number;
  }>;
  
  growthPercentage?: number;
}

export interface BlogStats {
  totalBlogs: number;
  creationStats: Array<{
    date: string;
    count: number;
  }>;
}

export interface TopQuizCreatorStats {
  userId: string;
  userName: string;
  quizCount: number;
}
