document.getElementById('exportTasks').addEventListener('click', () => {
    function formatDate(date) {
        const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
        const months = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];

        const dayName = days[date.getDay()];
        const monthName = months[date.getMonth()];
        const day = date.getDate();
        const year = date.getFullYear();

        return `${dayName}, ${day} ${monthName} ${year}`;
    }

    const today = new Date();
    const formattedDate = formatDate(today);
    const fileName = `To-do List ${formattedDate}.xlsx`;

    const ws = XLSX.utils.json_to_sheet([]);
    const ws_data = [
        ['No', 'Kegiatan', 'Keterangan'],
        ...tasks.map((task, index) => [
            index + 1,
            task.text,
            task.completed ? '✔' : '-'
        ])
    ];

    XLSX.utils.sheet_add_aoa(ws, ws_data, { origin: 'A1' });
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Tasks');

    XLSX.writeFile(wb, fileName);
});