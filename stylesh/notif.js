document.addEventListener('DOMContentLoaded', () => {
    // Pesan notifikasi dalam berbagai bahasa
    const notificationsMessages = {
        en: 'You have ${count} incomplete tasks!',
        es: '¡Tienes ${count} tareas incompletas!',
        fr: 'Vous avez ${count} tâches incomplètes!',
        id: 'Anda memiliki ${count} tugas yang belum diselesaikan!',
        zh: '你有 ${count} 个未完成的任务！', // Mandarin (China)
        hi: 'आपके पास ${count} अधूरी कार्य हैं!',
        ar: 'لديك ${count} مهام غير مكتملة!',
        bn: 'আপনার ${count} টি অসম্পন্ন কাজ রয়েছে!',
        pt: 'Você tem ${count} tarefas incompletas!',
        ru: 'У вас ${count} невыполненных задач!',
        ur: 'آپ کے پاس ${count} مکمل نہیں ہوئی کام ہیں!',
        de: 'Sie haben ${count} unerledigte Aufgaben!',
        ja: 'あなたには ${count} の未完了のタスクがあります！',
        pcm: 'You get ${count} incomplete tasks!',
        ar_eg: 'لديك ${count} مهمة غير مكتملة!',
        mr: 'तुमच्याकडे ${count} अपूर्ण कार्ये आहेत!',
        te: 'మీ వద్ద ${count} పూర్తి కాని పనులు ఉన్నాయి!',
        tr: '${count} tamamlanmamış görevleriniz var!',
        ta: 'உங்களுக்கு ${count} பூரணமாகாத பணிகள் உள்ளன!',
        yue: '你有 ${count} 個未完成嘅任務！', // Cantonese (Yue)
        // Tambahkan bahasa lainnya sesuai kebutuhan
    };

    const getUserLanguage = () => {
        const language = navigator.language || navigator.userLanguage;
        return language.split('-')[0]; // Mendapatkan bahasa utama, misal "en" dari "en-US"
    };

    const getIncompleteTaskCount = () => {
        return tasks.filter(task => !task.completed).length;
    };

    const showNotification = (incompleteCount) => {
        const userLanguage = getUserLanguage();
        const message = notificationsMessages[userLanguage] || notificationsMessages['en'];
        
        if (Notification.permission === 'granted') {
            new Notification('Task Reminder', {
                body: message.replace('${count}', incompleteCount),
                icon: 'stylesh/img/notification.png' // Ganti dengan ikon notifikasi yang sesuai
            });
        }
    };

    const scheduleNotification = (hour, minute) => {
        const now = new Date();
        const notificationTime = new Date(now);
        notificationTime.setHours(hour, minute, 0, 0);

        if (now > notificationTime) {
            notificationTime.setDate(notificationTime.getDate() + 1); // Set untuk hari berikutnya jika waktu saat ini sudah melewati jam notifikasi
        }

        const timeUntilNotification = notificationTime - now;

        setTimeout(() => {
            const incompleteCount = getIncompleteTaskCount();
            showNotification(incompleteCount);

            // Jadwalkan notifikasi berikutnya
            scheduleNotification(hour, minute);
        }, timeUntilNotification);
    };

    const startNotificationSchedule = () => {
        scheduleNotification(6, 30); // Pukul 06:30
        scheduleNotification(12, 0); // Pukul 12:00
        scheduleNotification(18, 0); // Pukul 18:00
    };

    if (Notification.permission === 'default') {
        Notification.requestPermission().then(permission => {
            if (permission === 'granted') {
                startNotificationSchedule();
            }
        });
    } else if (Notification.permission === 'granted') {
        startNotificationSchedule();
    }
});
