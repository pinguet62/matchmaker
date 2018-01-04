import {Application} from "express";
import {decrementProposition, getPropositions, incrementProposition} from "./proposition-services";
import {getMatches, getMessages} from "./tinder-services";

export function registerRoutes(app: Application) {
    app.get("/matches", async (req, res) => res.json(await getMatches()));
    app.get("/matches/:matchId/messages", async (req, res) => res.json(await getMessages(req.params.matchId)));

    app.get("/matches/:matchId/propositions", async (req, res) => res.json(await getPropositions(req.params.matchId)));
    app.post("/matches/:matchId/propositions/:propositionId/up", async (req, res) => res.json(await incrementProposition(req.params.matchId, req.params.propositionId)));
    app.post("/matches/:matchId/propositions/:propositionId/down", async (req, res) => res.json(await decrementProposition(req.params.matchId, req.params.propositwionId)));
}
