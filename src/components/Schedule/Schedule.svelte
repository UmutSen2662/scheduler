<script>
    import Cell from "./Cell.svelte";
    import { schedule } from "../../store";

    function fillTable(schedule) {
        let data = [];
        for (let i = 0; i < 12; i++) {
            let row = [`${(i + 8).toString().padStart(2, "0")}:40`]
            
            for (let j = 0; j < 5; j++) {
                let found = false;
                if (schedule.length > 0) {
                    schedule.forEach((c) => {
                        if (c.row == i && c.col == j) {
                            row.push(c);
                            found = true;
                        }
                    })
                }
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
        width: min(40rem, 96%);
    }

    th, td {
        text-align: center;
        width: 18%;
    }

    th:first-child, td:first-child {
        width: auto;
        padding: 0.2em;
    }
</style>