function inMonth(date, yr, mon) {
    return date.getFullYear() === yr && date.getMonth() === mon;
}

function sessionActive(logIn, logOut, yr, mon) {
    logOut = logOut || new Date();
    const activeStart = logIn.getFullYear() === yr && logIn.getMonth() <= mon;
    const activeEnd = logOut.getFullYear() === yr && logOut.getMonth() >= mon;

    return activeStart && (activeEnd || logOut.getFullYear() > yr);
}

function getStats(logs, yr) {
    const stats = Array.from({ length: 12 }, (_, i) => ({
        month: `${yr}-${String(i + 1).padStart(2, '0')}`,
        logInUsers: new Set(),
        activeUsers: new Set()
    }));

    logs.forEach(log => {
        const logIn = new Date(log.logged_in);
        const logOut = log.logged_out ? new Date(log.logged_out) : null;
        const user = log.userId;

        if (logIn.getFullYear() === yr) {
            const logInMonth = logIn.getMonth();
            stats[logInMonth].logInUsers.add(user);
        }

        for (let mon = 0; mon < 12; mon++) {
            if (sessionActive(logIn, logOut, yr, mon)) {
                stats[mon].activeUsers.add(user);
            }
        }
    });

    return stats.map(stat => ({
        month: stat.month,
        logInUsers: stat.logInUsers.size,
        activeUsers: stat.activeUsers.size
    }));
}

const logs = [
    { userId: 'u1', logged_in: '2024-01-05T10:00:00', logged_out: '2024-06-15T14:00:00' },
    { userId: 'u2', logged_in: '2024-02-10T09:00:00', logged_out: '2024-12-01T15:00:00' },
    { userId: 'u3', logged_in: '2024-03-15T10:00:00', logged_out: null }
];

console.log(getStats(logs, 2024));
