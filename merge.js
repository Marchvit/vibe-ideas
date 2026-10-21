// Синхронизация: идеи сравниваются по времени создания (created),
// из двух версий одной идеи остаётся более свежая (updated).
// Удалённые идеи не стираются, а помечаются deleted — так удаление тоже доходит до других устройств.
export function merge(mine, theirs) {
  const byId = new Map(mine.map(i => [i.created, i]));
  for (const i of theirs) {
    const old = byId.get(i.created);
    if (!old || i.updated > old.updated) byId.set(i.created, i);
  }
  return [...byId.values()].sort((a, b) => b.created - a.created);
}

const STATUSES = ['idea', 'work', 'done'];

// Данные пришли извне (файл или облако) — берём только записи правильного вида
export function parse(json) {
  const data = JSON.parse(json);
  if (!Array.isArray(data)) throw new Error('Ожидался список идей');
  return data
    .filter(i => typeof i?.text === 'string' && Number.isFinite(i.created) && STATUSES.includes(i.status))
    .map(i => ({
      text: i.text,
      status: i.status,
      created: i.created,
      updated: Number.isFinite(i.updated) ? i.updated : i.created,
      deleted: i.deleted === true,
    }));
}
