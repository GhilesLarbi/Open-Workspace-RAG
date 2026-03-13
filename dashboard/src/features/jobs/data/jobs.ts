import { faker } from '@faker-js/faker'

faker.seed(67890)

export const jobs = Array.from({ length: 500 }, () => {
  return {
    id: faker.string.uuid(),
    task_id:
      faker.helpers.maybe(() => `task_${faker.string.alphanumeric(10)}`, {
        probability: 0.9,
      }) ?? null,
    status: faker.helpers.arrayElement([
      'SUCCESS',
      'PENDING',
      'STARTED',
      'FAILURE',
    ]),

    config: {
      url: faker.internet.url(),
      crawling: {
        max_depth: faker.number.int({ min: 1, max: 5 }),
        max_pages: faker.number.int({ min: 10, max: 100 }),
        filters: faker.helpers.arrayElements([
          {
            type: 'url' as const,
            patterns: [faker.system.directoryPath(), faker.system.commonFileName()],
            reverse: faker.datatype.boolean(),
          },
          {
            type: 'seo' as const,
            keywords: [faker.lorem.word(), faker.lorem.word()],
            threshold: faker.number.float({ min: 0, max: 1, fractionDigits: 2 }),
          },
          {
            type: 'domain' as const,
            allowed: [faker.internet.domainName()],
            blocked: [faker.internet.domainName()],
          },
        ], faker.number.int({ min: 0, max: 4 })),
      },
      filtering: {
        word_count_threshold: faker.number.int({ min: 100, max: 1000 }),
        languages: faker.helpers.arrayElements(['EN', 'FR', 'AR'], faker.number.int({ min: 1, max: 2 })),
      },
      formating: {
        user_query: faker.helpers.maybe(() => faker.lorem.sentence(), { probability: 0.5 }) ?? null,
        min_word_threshold: faker.number.int({ min: 1, max: 10 }),
        threshold_type: faker.helpers.arrayElement(['fixed' as const, 'dynamic' as const]),
        threshold: faker.number.float({ min: 0, max: 1, fractionDigits: 2 }),
        ignore_links: faker.datatype.boolean(),
        ignore_images: faker.datatype.boolean(),
        skip_internal_links: faker.datatype.boolean(),
      },
    },

    result: {
      output: faker.lorem.sentence(),
      duration: faker.number.float({ min: 0.1, max: 10.0 }),
    },
    workspace_id: faker.string.uuid(),
    created_at: faker.date.past(),
    updated_at: faker.date.recent(),
  }
})