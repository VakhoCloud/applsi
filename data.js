// Sample video data
const sampleVideos = [
    {
        id: "1",
        title: "Introduction to Web Development",
        description: "Learn the basics of HTML, CSS, and JavaScript in this comprehensive tutorial.",
        category: "education",
        uploader: "TechAcademy",
        uploadDate: "2024-03-15",
        views: 12500,
        likes: 890,
        dislikes: 45,
        thumbnail: "https://pbs.twimg.com/media/EnR1XxeW8Agz9Wr.jpg:large",
        videoUrl: "https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
    },
    {
        id: "2",
        title: "Beginning and end of med school ",
        description: "Best gaming highlights and epic moments from various games.",
        category: "gaming",
        uploader: "GameMaster",
        uploadDate: "2024-03-14",
        views: 25000,
        likes: 1500,
        dislikes: 120,
        thumbnail: "https://people.com/thmb/LlTaSUVFZ8rpyWALixNHF64RsYE=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc():focal(749x0:751x2)/shrek-1-shrek-5-animation-style-030325-cf000ffa72c0401fb9d580767a93ffa4.jpg",
        videoUrl: "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4"
    },
    {
        id: "3",
        title: "Summer Vibes - Chill Music Mix",
        description: "Relaxing music playlist perfect for summer days.",
        category: "music",
        uploader: "MusicLover",
        uploadDate: "2024-03-13",
        views: 18000,
        likes: 1200,
        dislikes: 80,
        thumbnail: "https://cdn.mos.cms.futurecdn.net/DCNoD5GWBhpHbkybMGt33X-1000-80.jpg",
        videoUrl: "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4"
    },
    {
        id: "4",
        title: "JavaScript Advanced Concepts",
        description: "Deep dive into advanced JavaScript concepts and patterns.",
        category: "education",
        uploader: "CodeMaster",
        uploadDate: "2024-03-12",
        views: 9500,
        likes: 750,
        dislikes: 30,
        thumbnail: "https://www.hollywoodreporter.com/wp-content/uploads/2022/12/Print-Issue-38-biz_screen-Puss-In-Boots-MAIN-Publicity-H-2022.jpg?w=1296",
        videoUrl: "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4"
    },
    {
        id: "5",
        title: "Epic Gaming Montage",
        description: "Amazing gaming skills and highlights compilation.",
        category: "gaming",
        uploader: "ProGamer",
        uploadDate: "2024-03-11",
        views: 32000,
        likes: 2100,
        dislikes: 150,
        thumbnail: "https://picsum.photos/seed/gaming2/640/360",
        videoUrl: "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4"
    },
    {
        id: "6",
        title: "Classical Music Collection",
        description: "Beautiful classical music pieces for relaxation.",
        category: "music",
        uploader: "ClassicalFan",
        uploadDate: "2024-03-10",
        views: 15000,
        likes: 1000,
        dislikes: 60,
        thumbnail: "https://picsum.photos/seed/music2/640/360",
        videoUrl: "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4"
    },
    {
        id: "7",
        title: "Data Structures Explained",
        description: "Understanding fundamental data structures in programming.",
        category: "education",
        uploader: "TechTeacher",
        uploadDate: "2024-03-09",
        views: 11000,
        likes: 850,
        dislikes: 40,
        thumbnail: "https://picsum.photos/seed/education3/640/360",
        videoUrl: "https://storage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4"
    },
    {
        id: "8",
        title: "Gaming Tournament Highlights",
        description: "Best moments from the latest gaming tournament.",
        category: "gaming",
        uploader: "EsportsPro",
        uploadDate: "2024-03-08",
        views: 28000,
        likes: 1800,
        dislikes: 130,
        thumbnail: "https://picsum.photos/seed/gaming3/640/360",
        videoUrl: "https://storage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackOnStreetAndDirt.mp4"
    },
    {
        id: "9",
        title: "Pop Music Hits 2024",
        description: "Top pop music hits from around the world.",
        category: "music",
        uploader: "PopMusic",
        uploadDate: "2024-03-07",
        views: 22000,
        likes: 1600,
        dislikes: 100,
        thumbnail: "https://picsum.photos/seed/music3/640/360",
        videoUrl: "https://storage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4"
    },
    {
        id: "10",
        title: "Python Programming Basics",
        description: "Learn Python programming from scratch with practical examples.",
        category: "education",
        uploader: "PythonPro",
        uploadDate: "2024-03-06",
        views: 13500,
        likes: 920,
        dislikes: 55,
        thumbnail: "https://picsum.photos/seed/education4/640/360",
        videoUrl: "https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
    },
    {
        id: "11",
        title: "RPG Gameplay Walkthrough",
        description: "Complete walkthrough of the latest RPG game.",
        category: "gaming",
        uploader: "RPGMaster",
        uploadDate: "2024-03-05",
        views: 19000,
        likes: 1300,
        dislikes: 90,
        thumbnail: "https://picsum.photos/seed/gaming4/640/360",
        videoUrl: "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4"
    },
    {
        id: "12",
        title: "Jazz Fusion Collection",
        description: "Smooth jazz fusion tracks for your listening pleasure.",
        category: "music",
        uploader: "JazzFusion",
        uploadDate: "2024-03-04",
        views: 12000,
        likes: 850,
        dislikes: 45,
        thumbnail: "https://picsum.photos/seed/music4/640/360",
        videoUrl: "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4"
    },
    {
        id: "13",
        title: "Machine Learning Fundamentals",
        description: "Introduction to machine learning concepts and applications.",
        category: "education",
        uploader: "MLExpert",
        uploadDate: "2024-03-03",
        views: 16500,
        likes: 1100,
        dislikes: 75,
        thumbnail: "https://picsum.photos/seed/education5/640/360",
        videoUrl: "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4"
    },
    {
        id: "14",
        title: "FPS Game Highlights",
        description: "Best moments from competitive FPS gaming.",
        category: "gaming",
        uploader: "FPSPro",
        uploadDate: "2024-03-02",
        views: 21000,
        likes: 1400,
        dislikes: 110,
        thumbnail: "https://picsum.photos/seed/gaming5/640/360",
        videoUrl: "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4"
    },
    {
        id: "15",
        title: "Electronic Dance Music Mix",
        description: "High-energy EDM tracks for your workout session.",
        category: "music",
        uploader: "EDMPro",
        uploadDate: "2024-03-01",
        views: 17500,
        likes: 1200,
        dislikes: 85,
        thumbnail: "https://picsum.photos/seed/music5/640/360",
        videoUrl: "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4"
    },
    {
        id: "16",
        title: "React.js Complete Course",
        description: "Master React.js with practical projects and real-world applications.",
        category: "education",
        uploader: "ReactMaster",
        uploadDate: "2024-02-28",
        views: 14500,
        likes: 980,
        dislikes: 65,
        thumbnail: "https://picsum.photos/seed/education6/640/360",
        videoUrl: "https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
    },
    {
        id: "17",
        title: "Minecraft Speedrun World Record",
        description: "Watch this incredible speedrun of Minecraft's main story.",
        category: "gaming",
        uploader: "SpeedRunner",
        uploadDate: "2024-02-27",
        views: 35000,
        likes: 2400,
        dislikes: 180,
        thumbnail: "https://picsum.photos/seed/gaming6/640/360",
        videoUrl: "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4"
    },
    {
        id: "18",
        title: "Rock Classics Collection",
        description: "Greatest hits from the golden age of rock music.",
        category: "music",
        uploader: "RockLegends",
        uploadDate: "2024-02-26",
        views: 19500,
        likes: 1400,
        dislikes: 95,
        thumbnail: "https://picsum.photos/seed/music6/640/360",
        videoUrl: "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4"
    },
    {
        id: "19",
        title: "UI/UX Design Principles",
        description: "Learn the fundamentals of user interface and experience design.",
        category: "education",
        uploader: "DesignPro",
        uploadDate: "2024-02-25",
        views: 10500,
        likes: 780,
        dislikes: 40,
        thumbnail: "https://picsum.photos/seed/education7/640/360",
        videoUrl: "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4"
    },
    {
        id: "20",
        title: "League of Legends Pro Match",
        description: "Highlights from the latest professional League of Legends tournament.",
        category: "gaming",
        uploader: "LoLPro",
        uploadDate: "2024-02-24",
        views: 42000,
        likes: 2800,
        dislikes: 220,
        thumbnail: "https://picsum.photos/seed/gaming7/640/360",
        videoUrl: "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4"
    },
    {
        id: "21",
        title: "Hip Hop Mix 2024",
        description: "Latest hip hop tracks and remixes for your playlist.",
        category: "music",
        uploader: "HipHopMix",
        uploadDate: "2024-02-23",
        views: 16500,
        likes: 1150,
        dislikes: 75,
        thumbnail: "https://picsum.photos/seed/music7/640/360",
        videoUrl: "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4"
    },
    {
        id: "22",
        title: "Cloud Computing Basics",
        description: "Understanding cloud services and deployment strategies.",
        category: "education",
        uploader: "CloudExpert",
        uploadDate: "2024-02-22",
        views: 12500,
        likes: 850,
        dislikes: 50,
        thumbnail: "https://picsum.photos/seed/education8/640/360",
        videoUrl: "https://storage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4"
    },
    {
        id: "23",
        title: "Valorant Tournament Finals",
        description: "Epic moments from the Valorant Champions Tour finals.",
        category: "gaming",
        uploader: "ValorantPro",
        uploadDate: "2024-02-21",
        views: 38000,
        likes: 2600,
        dislikes: 200,
        thumbnail: "https://picsum.photos/seed/gaming8/640/360",
        videoUrl: "https://storage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackOnStreetAndDirt.mp4"
    },
    {
        id: "24",
        title: "Acoustic Guitar Covers",
        description: "Beautiful acoustic guitar covers of popular songs.",
        category: "music",
        uploader: "AcousticPro",
        uploadDate: "2024-02-20",
        views: 13500,
        likes: 920,
        dislikes: 60,
        thumbnail: "https://picsum.photos/seed/music8/640/360",
        videoUrl: "https://storage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4"
    },
    {
        id: "25",
        title: "DevOps Best Practices",
        description: "Essential practices for modern DevOps workflows.",
        category: "education",
        uploader: "DevOpsMaster",
        uploadDate: "2024-02-19",
        views: 11500,
        likes: 820,
        dislikes: 45,
        thumbnail: "https://picsum.photos/seed/education9/640/360",
        videoUrl: "https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
    }
];

// Utility functions for video data
function getVideosByDateRange(startDate, endDate) {
    return sampleVideos.filter(video => {
        const videoDate = new Date(video.uploadDate);
        return videoDate >= startDate && videoDate <= endDate;
    });
}

function getVideosByEngagement() {
    return [...sampleVideos].sort((a, b) => {
        const scoreA = (a.likes * 0.7) + (a.views * 0.3);
        const scoreB = (b.likes * 0.7) + (b.views * 0.3);
        return scoreB - scoreA;
    });
}

// Function to add new videos
function addNewVideo(video) {
    sampleVideos.unshift(video);
}

// Function to get video by ID
function getVideoById(id) {
    return sampleVideos.find(video => video.id === id);
}

// Function to update video
function updateVideo(id, updates) {
    const index = sampleVideos.findIndex(video => video.id === id);
    if (index !== -1) {
        sampleVideos[index] = { ...sampleVideos[index], ...updates };
        return sampleVideos[index];
    }
    return null;
}

// Function to get videos by category
function getVideosByCategory(category) {
    return sampleVideos.filter(video => video.category === category);
}

// Function to get videos by uploader
function getVideosByUploader(uploader) {
    return sampleVideos.filter(video => video.uploader === uploader);
}

// Function to get trending videos
function getTrendingVideos() {
    return [...sampleVideos].sort((a, b) => {
        const scoreA = (a.likes * 0.7) + (a.views * 0.3);
        const scoreB = (b.likes * 0.7) + (b.views * 0.3);
        return scoreB - scoreA;
    });
}

// Function to get latest videos
function getLatestVideos() {
    return [...sampleVideos].sort((a, b) => {
        return new Date(b.uploadDate) - new Date(a.uploadDate);
    });
}

// Function to get most viewed videos
function getMostViewedVideos() {
    return [...sampleVideos].sort((a, b) => b.views - a.views);
}

// Function to get most liked videos
function getMostLikedVideos() {
    return [...sampleVideos].sort((a, b) => b.likes - a.likes);
}

console.log('data.js loaded successfully'); 