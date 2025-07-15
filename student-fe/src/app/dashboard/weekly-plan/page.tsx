"use client";

import { useQuery } from "@tanstack/react-query";

import {
  Table,
  TableRow,
  TableBody,
  TableCell,
  TableHead,
  TableContainer,
} from "@mui/material";

import { listWeeklySchedule } from "@/apis/classes";

export default function WeeklyPlan() {
  const { data, isPending } = useQuery({
    queryKey: ["list-weekly-schedule"],
    queryFn: listWeeklySchedule,
  });

  return (
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell />
            <TableCell>شنبه</TableCell>
            <TableCell>یکشنبه</TableCell>
            <TableCell>دوشنبه</TableCell>
            <TableCell>سه‌شنبه</TableCell>
            <TableCell>چهارشنبه</TableCell>
            <TableCell>پنج‌شنبه</TableCell>
            <TableCell>جمعه</TableCell>
          </TableRow>
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
            data[0].classes.map(
              (
                classItem: any //eslint-disable-line
              ) => (
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
                  {Array.from(Array(6 - classItem.day_of_week)).map((i) => (
                    <TableCell key={i}>{i}</TableCell>
                  ))}
                </TableRow>
              )
            )}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
