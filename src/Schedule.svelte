<script lang="ts">
    import Cell from "./Cell.svelte";
    import { schedule } from "./store";

    function fillTable(schedule) {
        let data = [];
        for (let i = 0; i < 12; i++) {
            let row: any[] = [`${i + 8}:40`]
            
            for (let j = 0; j < 5; j++) {
                let found = false;
                schedule.forEach((c) => {
                    if (c.row == i && c.col == j) {
                        row.push(c);
                        found = true;
                    }
                })
                if (!found) {
                    row.push("c" + i.toString(16) + j.toString(16));
                }
            }
            data.push(row);
        }
        return data;
    }

</script>

<h2>Schedule</h2>
<table>
    <thead>
        <tr>
            <th>Time</th>
            <th>Monday</th>
            <th>Tuesday</th>
            <th>Wednesday</th>
            <th>Thursday</th>
            <th>Friday</th>
        </tr>
    </thead>
    <tbody>
        {#each fillTable($schedule) as row}
        <tr>
            <td>{row[0]}</td>
            {#each row.slice(1) as c}
                <Cell course={c} />
            {/each}
        </tr>
        {/each}
    </tbody>
</table>

<style>
    h2 {
        margin: 0;
        padding: 0.5rem;
    }

    table {
        font-weight: 700;
        font-size: min(1rem, 2.4vw);
        border-collapse: collapse;
        width: min(40rem, 96%);
    }

    th, td {
        border: 2px solid #000;
        text-align: center;
        padding: 0.3em;
        width: 18%;
    }

    thead {
        background-color: #ddd;
    }

    tr:nth-child(even) {
        background-color: #ddd;
    }

    th:first-child, td:first-child {
        width: auto;
        padding: 0.2em;
    }
</style>