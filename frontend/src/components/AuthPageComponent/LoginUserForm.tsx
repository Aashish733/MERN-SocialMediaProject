import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginUserSchema } from "../../schemas/auth.schema";
import type { LoginUserFormData } from "../../schemas/auth.schema";
import { useState } from "react";
import { toast } from "sonner";
import { loginUser } from "../../api/auth.api";
import Spinner from "../General/Spinner";
import { useDispatch } from "react-redux";
import { setUser } from "../../store/slices/authSlice";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/Card";

const LoginUserForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<LoginUserFormData>({
    resolver: zodResolver(loginUserSchema),
  });

  const onSubmit = async (data: LoginUserFormData) => {
    try {
      setLoading(true);
      const response = await loginUser(data);
      dispatch(setUser(response.data.user));
      toast.success(`Welcome Back ${response.data.user.username}`);
      reset();
      navigate("/");
    } catch (error: any) {
      toast.error(error.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="border-border shadow-xl">
      <CardHeader>
        <CardTitle className="text-center text-xl">Login To Your Account</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium leading-none text-foreground">Username or Email</label>
            <Input
              type="text"
              {...register("identifier")}
              placeholder="Enter your username or email"
              className={errors.identifier ? "border-destructive focus-visible:ring-destructive" : ""}
            />
            <p className="text-destructive text-xs min-h-[16px]">{errors.identifier?.message}</p>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium leading-none text-foreground">Password</label>
            <Input
              type="password"
              {...register("password")}
              placeholder="Enter your password"
              className={errors.password ? "border-destructive focus-visible:ring-destructive" : ""}
            />
            <p className="text-destructive text-xs min-h-[16px]">{errors.password?.message}</p>
          </div>

          <div className="text-center">
            <Link to="/register" className="text-sm text-muted-foreground hover:text-primary transition-colors hover:underline">
              Don't have an account?
            </Link>
          </div>

          <Button type="submit" disabled={loading} className="w-full h-11">
            {loading ? <Spinner /> : "Login"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default LoginUserForm;
