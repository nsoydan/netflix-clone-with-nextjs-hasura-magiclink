import videoTestData from "../data/videos.json";
import { getMyListVideos, getWatchedVideos } from "./db/hasura";

const fetchVideos = async (url) => {
  const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;

  const BASE_URL = "youtube.googleapis.com/youtube/v3";
  //https://BAASE_URL/URL&key=[YOUR_API_KEY]'
  const response = await fetch(
    ` https://${BASE_URL}/${url}&maxResults=5&key=${YOUTUBE_API_KEY}
    `
  );
  return await response.json();
};

export const getCommonVideos = async (url) => {
  try {
    const isDEv = process.env.DEVELOPMENT;

    const data = isDEv ? videoTestData : await fetchVideos(url);
    if (data?.error) {
      console.log("Youtube API Error", data.error);
      return [];
    }

    return data?.items.map((item) => {
      const id = item?.id.videoId || item.id;
      return {
        imgUrl: `https://i.ytimg.com/vi/${id}/maxresdefault.jpg`,
        title: item.snippet.title,
        id, // === undefined ? "aaa" : item.id.videoId,
        description: item.snippet.description,
        publishTime: item.snippet.publishedAt,
        channelTitle: item.snippet.channelTitle,
        statistics: item.statistics ? item.statistics : { viewCount: 0 },
      };
    });
  } catch (error) {
    return [];
  }
};

export const getVideos = (searchQuery) => {
  const URL = `search?part=snippet&q=${searchQuery}&type=video`;
  return getCommonVideos(URL);
};

export const getPopularVideos = () => {
  const URL =
    "videos?part=snippet%2CcontentDetails%2Cstatistics&chart=mostPopular&regionCode=US";

  return getCommonVideos(URL);
};
export const getYoutubeVideoById = (videoId) => {
  const URL = `videos?part=snippet%2CcontentDetails%2Cstatistics&id=${videoId}`;

  return getCommonVideos(URL);
};

export const getWatchItAgainVideos = async (userId, token) => {
  const videos = await getWatchedVideos(userId, token);
  return (
    videos?.map((video) => {
      return {
        id: video.videoId,
        imgUrl: `https://i.ytimg.com/vi/${video.videoId}/maxresdefault.jpg`,
      };
    }) || []
  );
};

export const getMyList = async (userId, token) => {
  const videos = await getMyListVideos(userId, token);
  return (
    videos?.map((video) => {
      return {
        id: video.videoId,
        imgUrl: `https://i.ytimg.com/vi/${video.videoId}/maxresdefault.jpg`,
      };
    }) || []
  );
};
