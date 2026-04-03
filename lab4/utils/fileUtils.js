import * as FileSystem from 'expo-file-system';

// Форматування розміру файлу
export function formatSize(bytes) {
  if (bytes == null) return '—';
  if (bytes === 0) return '0 Б';
  const units = ['Б', 'КБ', 'МБ', 'ГБ'];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${units[i]}`;
}

// Форматування дати
export function formatDate(modTime) {
  if (!modTime) return '—';
  const d = new Date(modTime);
  return d.toLocaleString('uk-UA');
}

export function getFileType(name) {
  const ext = name.split('.').pop().toLowerCase();
  const map = {
    txt: 'Текстовий файл',
    js: 'JavaScript',
    json: 'JSON',
    md: 'Markdown',
    jpg: 'Зображення JPEG',
    jpeg: 'Зображення JPEG',
    png: 'Зображення PNG',
    pdf: 'PDF документ',
    mp3: 'Аудіо MP3',
    mp4: 'Відео MP4',
  };
  return map[ext] || `Файл .${ext}`;
}

// Іконка для файлу/папки
export function getIcon(item) {
  if (item.isDirectory) return '📁';
  const ext = item.name.split('.').pop().toLowerCase();
  const map = {
    txt: '📄', js: '📜', json: '🔧', md: '📝',
    jpg: '🖼', jpeg: '🖼', png: '🖼',
    pdf: '📕', mp3: '🎵', mp4: '🎬',
  };
  return map[ext] || '📄';
}

// Чи можна відкрити файл для читання/редагування
export function isTextFile(name) {
  const ext = name.split('.').pop().toLowerCase();
  return ['txt', 'md', 'js', 'json', 'ts', 'jsx', 'tsx', 'css', 'html'].includes(ext);
}

// Зчитати вміст директорії з інфо про кожен елемент
export async function readDirectory(dirUri) {
  const items = await FileSystem.readDirectoryAsync(dirUri);
  const detailed = await Promise.all(
    items.map(async (name) => {
      const uri = dirUri.endsWith('/') ? dirUri + name : dirUri + '/' + name;
      try {
        const info = await FileSystem.getInfoAsync(uri, { size: true });
        return {
          name,
          uri,
          isDirectory: info.isDirectory,
          size: info.size,
          modificationTime: info.modificationTime,
        };
      } catch {
        return { name, uri, isDirectory: false, size: 0, modificationTime: null };
      }
    })
  );
  // Папки першими, потім файли, обидва по алфавіту
  return detailed.sort((a, b) => {
    if (a.isDirectory !== b.isDirectory) return a.isDirectory ? -1 : 1;
    return a.name.localeCompare(b.name);
  });
}

// Статистика пам'яті
export async function getStorageInfo() {
  try {
    const free  = await FileSystem.getFreeDiskStorageAsync();
    const total = await FileSystem.getTotalDiskCapacityAsync();
    const used  = total - free;
    return { total, free, used };
  } catch {
    return { total: 0, free: 0, used: 0 };
  }
}
