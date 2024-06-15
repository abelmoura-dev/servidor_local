import React, { useState, useContext, useEffect, useRef } from "react";
import { Link as RouterLink } from "react-router-dom";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import Link from "@material-ui/core/Link";
import Grid from "@material-ui/core/Grid"; 
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import { i18n } from "../../translate/i18n";
import { AuthContext } from "../../context/Auth/AuthContext";
import logo from "../../assets/logo.png";
import { createApi } from "unsplash-js";
import WhatsAppChat from "../../components/WhatsappHelpEmail/index";
import HCaptcha from '@hcaptcha/react-hcaptcha';
import { toast } from 'react-toastify';


const unsplash = createApi({
	accessKey: process.env.REACT_APP_UNSPLASH_API_KEY,
});

const getRandomBackground = async () => {
	try {
		const lastRequestDate = localStorage.getItem("lastBackgroundRequestDate");
		const currentDate = new Date().toISOString().split("T")[0];
	
		if (lastRequestDate === currentDate) {
		// Se já foi feita uma solicitação hoje, retorna a URL armazenada
		const storedBackground = localStorage.getItem("backgroundImage");
		if (storedBackground) {
			return storedBackground;
		}
		}
	
		// Se não houve solicitação hoje ou não há imagem armazenada, faz uma nova solicitação
		const response = await unsplash.photos.getRandom({ query: "landscape" });
		if (response.errors) {
		console.error("Erro ao obter imagem aleatória:", response.errors[0]);
		return null;
		}
	
		const newBackground = response.response.urls.regular;
	
		// Armazena a nova imagem e a data da solicitação
		localStorage.setItem("backgroundImage", newBackground);
		localStorage.setItem("lastBackgroundRequestDate", currentDate);
	
		return newBackground;
	} catch (error) {
		console.error("Erro ao obter imagem aleatória:", error.message);
		return null;
	}
};



const useStyles = makeStyles(theme => ({
	root: {
		transition: "background-image 0.5s ease-in-out",
		width: "100vw",
		height: "100vh",
		backgroundRepeat: "no-repeat",
		backgroundSize: "100% 100%",
		backgroundPosition: "center",
		display: "flex",
		flexDirection: "column",
		alignItems: "center",
		justifyContent: "center",
		textAlign: "center",
	},
	paper: {
		backgroundColor: theme.palette.login, 
		display: "flex",
		flexDirection: "column",
		alignItems: "center",
		padding: "55px 30px",
		borderRadius: "12.5px",
	},
	avatar: {
		margin: theme.spacing(1),  
		backgroundColor: theme.palette.secondary.main,
	},
	form: {
		width: "100%", // Fix IE 11 issue.
		marginTop: theme.spacing(1),
	},
	submit: {
		margin: theme.spacing(3, 0, 2),
	},
	powered: {
		color: "white"
	}
}));

const Login = () => {
	const classes = useStyles();
	const [user, setUser] = useState({ email: "", password: "" });
	const { handleLogin } = useContext(AuthContext);
	const [backgroundImage, setBackgroundImage] = useState("");
	const [loading, setLoading] = useState(true);
	const [hCaptchaToken, setHCaptchaToken] = useState(null);
	const [resetCaptcha, setResetCaptcha] = useState(false);
	const isMounted = useRef(true);

	useEffect(() => {
        return () => {
            // O componente está prestes a ser desmontado
            isMounted.current = false;
        };
    }, []);

	const handleHCaptchaVerify = (token) => {
		if (isMounted.current) {
			setHCaptchaToken(token);
			if (!token) {
			  setResetCaptcha(true);
			}
		  }
	  };

	const handleChangeInput = e => {
		setUser({ ...user, [e.target.name]: e.target.value });
	};

	const handlSubmit = e => {
		e.preventDefault(); // Evita o comportamento padrão do formulário de atualizar a página

		if (!hCaptchaToken) {
			toast.error('Por favor verifique se marcou a caixa "Sou Humano" para continuar!');
			return;
		}
	
		const userDataWithToken = { ...user, hCaptchaToken };
		handleLogin(userDataWithToken);

		// Limpar campos de email e senha após o login
		setUser({ email: "", password: "" });

		// Resetar o componente HCaptcha
		setResetCaptcha(true);
		setTimeout(() => {
		  setResetCaptcha(false);
		}, 0);
	};

	useEffect(() => {
		const fetchRandomBackground = async () => {
		  try {
			const randomBackground = await getRandomBackground();
			setBackgroundImage(randomBackground);
		  } catch (error) {
			console.error("Erro ao obter imagem aleatória:", error.message);
		  } finally {
			setLoading(false);
		  }
		};
	  
		fetchRandomBackground();
	  }, []);

	  useEffect(() => {
		const cleanup = async () => {
		  // Adicione aqui qualquer código de limpeza ou cancelamento de assinatura
		  // que seja necessário antes da desmontagem do componente
		};
	
		return () => {
		  cleanup();
		  isMounted.current = false;
		};
	  }, []);

	return !loading ? (
		<div className={classes.root}
		style={{
		backgroundImage: `url(${backgroundImage})`,
		backgroundRepeat: "no-repeat",
		backgroundSize: "100% 100%",
		backgroundPosition: "center",
		}}>
		
		<Container component="main" maxWidth="xs">
			<CssBaseline/>
			<div className={classes.paper}>
				<div>
					<img style={{ margin: "0 auto", width: "90%" }} src={logo} alt="Whats" />
				</div>
				<form className={classes.form} noValidate onSubmit={handlSubmit}>
					<TextField
						variant="outlined"
						margin="normal"
						required
						fullWidth
						id="email"
						label={i18n.t("login.form.email")}
						name="email"
						value={user.email}
						onChange={handleChangeInput}
						autoComplete="email"
						autoFocus
					/>
					<TextField
						variant="outlined"
						margin="normal"
						required
						fullWidth
						name="password"
						label={i18n.t("login.form.password")}
						type="password"
						id="password"
						value={user.password}
						onChange={handleChangeInput}
						autoComplete="current-password"
					/>
					<div style={{ marginTop: '20px' }}>
					<HCaptcha
					key={resetCaptcha ? "reset" : "normal"}
					sitekey={process.env.REACT_APP_SITE_KEY_HCAPTCHA}
					onVerify={handleHCaptchaVerify}
					/>
					</div>
					<Button
						type="submit"
						fullWidth
						variant="contained"
						color="primary"
						className={classes.submit}
					>
						{i18n.t("login.buttons.submit")}
					</Button>
					{ <Grid container>
						<Grid item>
							<Link
								href="#"
								variant="body2"
								component={RouterLink}
								to="/signup"
							>
								{i18n.t("login.buttons.register")}
							</Link>
						</Grid>
					</Grid> }
				</form>
			
			</div>

			<WhatsAppChat />
			
			
		</Container>
		</div>
	) : null;
};

export default Login;