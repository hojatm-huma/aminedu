"use client";

import { retrieveProfile } from "@/apis/classes";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
} from "@mui/material";
import { useQuery } from "@tanstack/react-query";

const PROFILE_FIELDS = [
  { key: "first_name", label: "نام" },
  { key: "last_name", label: "نام خانوادگی" },
  { key: "national_code", label: "کد ملی" },
  { key: "field_of_study", label: "رشته تحصیلی" },
  { key: "stage", label: "پایه تحصیلی" },
  { key: "gender", label: "جنسیت" },
  { key: "phone_number", label: "شماره تلفن" },
  { key: "supervisor_phone_number", label: "شماره تلفن سرپرست" },
  { key: "province", label: "استان" },
  { key: "city", label: "شهر" },
  { key: "village", label: "روستا" },
  { key: "address", label: "آدرس" },
  { key: "postcode", label: "کد پستی" },
];

export default function Profile() {
  const { data, isPending } = useQuery({
    queryKey: ["retrieve-student-profile"],
    queryFn: retrieveProfile,
  });

  return (
    <TableContainer>
      <Table>
        <TableBody>
          {!isPending &&
            PROFILE_FIELDS.map((field) => (
              <TableRow key={field.key}>
                <TableCell>
                  <strong>{field.label}:</strong>
                </TableCell>
                <TableCell>{data[field.key] || "-"} </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
