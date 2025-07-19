"use client";

import { getToken } from "@/apis/auth";
import { myAxios } from "@/apis/base";
import { setTokens } from "@/utils/tokens";
import {
  Button,
  Container,
  Paper,
  Snackbar,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useMutation } from "@tanstack/react-query";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function SignIn({}) {
  const router = useRouter();

  const mutation = useMutation({
    mutationFn: getToken,
    onSuccess: (data) => {
      const { access, refresh } = data;

      if (typeof window != undefined) {
        setTokens(access, refresh);
        myAxios.defaults.headers.common["Authorization"] = `Bearer ${access}`;
        router.push("/dashboard");
      }
    },
  });

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  return (
    <Stack justifyContent="center" alignItems="center" minHeight="100vh">
      <Snackbar
        open={mutation.isError}
        autoHideDuration={6000}
        message="خطا در ورود. اطلاعات وارد شده را مجددا چک کنید."
      />
      <Container maxWidth="sm">
        <Paper elevation={3} sx={{ padding: 3, margin: 3 }}>
          <Stack spacing={2}>
            <Image
              style={{ margin: "auto" }}
              src={"/logo.png"}
              alt="Logo"
              width={100}
              height={100}
            />
            <Typography
              variant="h5"
              align="center"
              sx={{ paddingBottom: 2, fontWeight: "bold" }}
            >
              ورود
            </Typography>
            <TextField
              label="نام کاربری"
              variant="outlined"
              size="small"
              dir="ltr"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <TextField
              label="رمز عبور"
              variant="outlined"
              type="password"
              size="small"
              dir="ltr"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button
              variant="contained"
              color="primary"
              disabled={mutation.isPending}
              loading={mutation.isPending}
              onClick={() => {
                mutation.mutate({
                  username: username,
                  password: password,
                });
              }}
            >
              ورود
            </Button>
          </Stack>
        </Paper>
      </Container>
    </Stack>
  );
}
