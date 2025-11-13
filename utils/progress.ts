import { LearningCategory, Language, Topic } from '../types';

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

export const getResumeLink = (username: string, learningData: LearningCategory[]): { language: Language, topic: Topic } | null => {
  if (!username) return null;

  const progress = getProgress(username);
  const startedLanguages = learningData.flatMap(cat => cat.languages).filter(lang => isLanguageStarted(username, lang.slug));

  // Prioritize started languages
  for (const lang of startedLanguages) {
      const langProgress = progress[lang.slug];
      for (const topic of lang.topics) {
          if (!langProgress[topic.slug]) {
              return { language: lang, topic: topic }; // Next topic in an active language
          }
      }
  }

  // If no started languages or all started are complete, suggest the very first topic overall
  if (learningData.length > 0 && learningData[0].languages.length > 0 && learningData[0].languages[0].topics.length > 0) {
      const firstLang = learningData[0].languages[0];
      const firstTopic = firstLang.topics[0];
      // Only suggest this if the user hasn't started anything yet
      if (Object.keys(progress).length === 0) {
        return { language: firstLang, topic: firstTopic };
      }
  }

  return null; // User has completed everything or there's no data
};
