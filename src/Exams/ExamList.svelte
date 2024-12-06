<script>
    import { getExamList } from "../supabase.svelte";
    import TagsInput from "./TagsInput.svelte";
    import { tags } from "../store";
    
    let examList = [];
    let exams = $state(examList);

    tags.subscribe((value) => {
        const codes = Array.from(value);
        const arr = examList.filter((x) => codes.includes(x.course_exam.match(/([A-Z]{3,4})\s?(\d{3,4})/g)[0]));
        exams = calculations(arr);
    })

    getExamList().then((data) => {
        examList = data;
        const codes = Array.from($tags);
        const arr = examList.filter((x) => codes.includes(x.course_exam.match(/([A-Z]{3,4})\s?(\d{3,4})/g)[0]));
        exams = calculations(arr);
    });


    function calculations(exams) {
        let list = [];
        let prevDate = Date.now();
        
        exams.forEach(exam => {
            const dateObj = new Date(exam.start_time);
            // Get the components of the date
            const year = dateObj.getFullYear();
            const month = String(dateObj.getMonth() + 1).padStart(2, "0"); // Month is zero-indexed, so add 1
            const day = String(dateObj.getDate()).padStart(2, "0");
            const weekday = dateObj.toLocaleString("en-US", { weekday: "short" });
            const hour = String(dateObj.getHours()).padStart(2, "0");
            const minute = String(dateObj.getMinutes()).padStart(2, "0");
            // Format the string
            const formattedDate = `${year}-${month}-${day} ${weekday} ${hour}:${minute}`;
            const now = Date.now() - new Date().getTimezoneOffset() * 60000;
            const today = now - (now % 86400000);
            const date = dateObj.getTime() - (dateObj.getTime() % 86400000);
            
            list.push({
                course_exam: exam.course_exam,
                days_until: Math.max(
                    Math.floor(date / 86400000) - Math.floor(today / 86400000),
                    0
                ),
                days_between: Math.max(
                    Math.floor(date / 86400000) - Math.floor(prevDate / 86400000),
                    0
                ),
                start_time: formattedDate,
                classrooms: exam.classrooms
            });
            
            prevDate = date;
        });
        return list;
    }

</script>

<TagsInput />
<div>
    <table>
        <thead>
            <tr>
                <th>Course Exam</th>
                <th>Days Until</th>
                <th>Days Between</th>
                <th>Start Time</th>
                <th>Classrooms</th>
            </tr>
        </thead>
        <tbody>
            {#each exams as exam}
                <tr>
                    <td>{exam.course_exam}</td>
                    <td>{exam.days_until}</td>
                    <td>{exam.days_between}</td>
                    <td>{exam.start_time}</td>
                    <td>{exam.classrooms}</td>
                </tr>
            {/each}
        </tbody>
    </table>
</div>

<style>
    div {
        width: 96%;
        z-index: 1000;
        display: flex;
        overflow-x: auto;
        margin-bottom: 3rem;
        justify-content: space-around;
    }

    td {
        text-wrap: nowrap;
    }
    td:last-child {
        text-wrap: wrap;
    }
    @media screen and (max-width: 767px) {
        td:last-child {
            text-wrap: nowrap;
        }
    }

</style>