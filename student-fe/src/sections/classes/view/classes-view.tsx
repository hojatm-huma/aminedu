import { Table, TableRow, TableBody, TableCell, TableHead, Typography } from '@mui/material';

import { DashboardContent } from 'src/layouts/dashboard';

// ----------------------------------------------------------------------

export function ClassesView() {
  return (
    <DashboardContent>
      <Typography variant="h4" sx={{ mb: 3 }}>
        هفته جاری
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
        </TableHead>
        <TableBody>
          <TableRow>
            <TableCell>ریاضی</TableCell>
            <TableCell />
            <TableCell />
            <TableCell />
            <TableCell />
            <TableCell>8:00</TableCell>
            <TableCell />
          </TableRow>
          <TableRow>
            <TableCell>فیزیک</TableCell>
            <TableCell />
            <TableCell />
            <TableCell />
            <TableCell>9:00</TableCell>
            <TableCell />
            <TableCell />
          </TableRow>
        </TableBody>
      </Table>

      <Typography variant="h4" sx={{ mt: 5, mb: 3 }}>
        همه کلاس‌ها
      </Typography>
      <Table>
        <TableHead>
          <TableCell>نام کلاس</TableCell>
          <TableCell>مدرس</TableCell>
          <TableCell>روز</TableCell>
          <TableCell>زمان شروع</TableCell>
        </TableHead>
        <TableBody>
          <TableRow>
            <TableCell>ریاضی</TableCell>
            <TableCell>آقای رضایی</TableCell>
            <TableCell>شنبه</TableCell>
            <TableCell>8:00</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>فیزیک</TableCell>
            <TableCell>خانم حسینی</TableCell>
            <TableCell>یکشنبه</TableCell>
            <TableCell>9:00</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </DashboardContent>
  );
}
