import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import { makeStyles } from "@material-ui/core/styles";
import TicketsManager from "../../components/TicketsManagerTabs/";
import Ticket from "../../components/Ticket/";
import { i18n } from "../../translate/i18n";
import { useSettingsContext } from "../../context/SettingsContext/SettingsContext";

const useStyles = makeStyles(theme => ({
	chatContainer: {
		flex: 1,
		// backgroundColor: "#eee",
		padding: theme.spacing(1), //Aqui ele ajusta espaço na tela de ticket
		height: `calc(100% - 48px)`,
		overflowY: "hidden",
	},

	chatPapper: {
		// backgroundColor: "red",
		display: "flex",
		height: "100%",
	},

	contactsWrapper: {
		display: "flex",
		height: "100%",
		flexDirection: "column",
		overflowY: "hidden",
	},
	messagesWrapper: {
		display: "flex",
		height: "100%",
		flexDirection: "column",
	},
	welcomeMsg: {
		backgroundColor: theme.palette.boxticket, //DARK MODE PLW DESIGN//
		display: "flex",
		justifyContent: "space-evenly",
		alignItems: "center",
		height: "100%",
		textAlign: "center",
	},
}));

const TicketsCustom = () => {
	const { settings } = useSettingsContext();
	const classes = useStyles();
	const { ticketId } = useParams();

	useEffect(() => {
	// Lógica para lidar com as alterações nas configurações
	console.log("Configurações foram atualizadas:", settings);
	}, [settings]); // Execute este efeito sempre que as configurações mudarem

	if (!settings || Object.keys(settings).length === 0) {
		return null; // ou exiba um carregando, se apropriado
	}

	return (
		<div className={classes.chatContainer}>
			<div className={classes.chatPapper}>
				<Grid container spacing={0}>
					<Grid item xs={4} className={classes.contactsWrapper}>
						<TicketsManager settings={settings} />
					</Grid>
					<Grid item xs={8} className={classes.messagesWrapper}>
						{ticketId ? (
							<>
								<Ticket />
							</>
						) : (
							<Paper square variant="outlined" className={classes.welcomeMsg}>
							<span>{i18n.t("chat.noTicketMessage")}</span>
							</Paper>
						)}
					</Grid>
				</Grid>
			</div>
		</div>
	);
};

export default TicketsCustom;