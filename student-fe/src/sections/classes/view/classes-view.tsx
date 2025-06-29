import { useQuery } from '@tanstack/react-query';

import { Table, TableRow, TableBody, TableCell, TableHead, Typography } from '@mui/material';

import { listWeeklySchedule } from 'src/apis/classes';
import { DashboardContent } from 'src/layouts/dashboard';

// ----------------------------------------------------------------------

export function ClassesView() {
  const { data, isPending } = useQuery({
    queryKey: ['list-weekly-schedule'],
    queryFn: listWeeklySchedule,
  });

  console.log(data);

  return (
    <DashboardContent>
      <Typography variant="h4" sx={{ mb: 3 }}>
        برنامه کلاسی
      </Typography>
      <Table>
        <TableHead>
          <TableCell />
          <TableCell>شنبه</TableCell>
          <TableCell>یکشنبه</TableCell>
          <TableCell>دوشنبه</TableCell>
          <TableCell>سه‌شنبه</TableCell>
          <TableCell>چهارشنبه</TableCell>
          <TableCell>پنج‌شنبه</TableCell>
          <TableCell>جمعه</TableCell>
        </TableHead>
        <TableBody>
          {isPending && (
            <TableRow>
              <TableCell colSpan={8} align="center">
                در حال بارگذاری...
              </TableCell>
            </TableRow>
          )}
          {data &&
            data[0].classes.map((classItem: any) => (
              <TableRow key={classItem.id}>
                <TableCell>{classItem.lesson.name}</TableCell>
                {Array.from(Array(classItem.day_of_week)).map((i) => (
                  <TableCell key={i}>{i}</TableCell>
                ))}
                <TableCell>
                  {classItem.starts_at}
                  <br />
                  {classItem.ends_at}
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </DashboardContent>
  );
}
