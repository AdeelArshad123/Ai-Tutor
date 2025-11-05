const getProgressKey = (username: string) => `stacktutor_progress_${username}`;

interface Progress {
  [languageSlug: string]: {
    [topicSlug: string]: boolean;
  };
}

const getProgress = (username: string): Progress => {
  if (!username) return {};
  try {
    const progress = localStorage.getItem(getProgressKey(username));
    return progress ? JSON.parse(progress) : {};
  } catch (error) {
    console.error("Failed to parse progress from localStorage", error);
    return {};
  }
};

const saveProgress = (username: string, progress: Progress) => {
  if (!username) return;
  try {
    localStorage.setItem(getProgressKey(username), JSON.stringify(progress));
  } catch (error)
 {
    console.error("Failed to save progress to localStorage", error);
  }
};

export const markTopicAsComplete = (username: string, languageSlug: string, topicSlug: string) => {
  const progress = getProgress(username);
  if (!progress[languageSlug]) {
    progress[languageSlug] = {};
  }
  progress[languageSlug][topicSlug] = true;
  saveProgress(username, progress);
};

export const isTopicComplete = (username: string, languageSlug: string, topicSlug: string): boolean => {
  const progress = getProgress(username);
  return !!progress[languageSlug]?.[topicSlug];
};

export const isLanguageStarted = (username: string, languageSlug: string): boolean => {
  const progress = getProgress(username);
  return !!progress[languageSlug];
};

export const getLanguageProgress = (username: string, languageSlug: string, totalTopics: number): number => {
    const progress = getProgress(username);
    const completedTopics = progress[languageSlug] ? Object.keys(progress[languageSlug]).length : 0;
    if (totalTopics === 0) return 0;
    return Math.round((completedTopics / totalTopics) * 100);
}