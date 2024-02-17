export const __findEmpty = () => ({ sort: () => Promise.resolve<unknown>([]) });
export const __findNoEndDate = () => ({
  sort: () => Promise.resolve([{ updateOne: () => Promise.resolve() }]),
});
export const __findEndDate = () => ({
  sort: () =>
    Promise.resolve([{ updateOne: () => Promise.resolve(), end: new Date() }]),
});

export class EntryModel {
  constructor() {}
  save() {
    return Promise.resolve();
  }
  static find = __findEmpty;
}
