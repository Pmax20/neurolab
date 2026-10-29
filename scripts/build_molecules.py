"""Erzeugt validierte 3D-Strukturdaten für die Molekülbibliothek.
SMILES -> RDKit-Sanitisierung (Valenzprüfung) -> ETKDGv3-Einbettung -> MMFF94-Optimierung.
Ausgabe: src/content/molecules.generated.json
"""
import json, sys
from rdkit import Chem
from rdkit.Chem import AllChem, rdMolDescriptors, Descriptors, rdCIPLabeler

MOLS = [
  # id, Name, SMILES, Gruppe
  ("wasser","Wasser","O","Grundmoleküle"),
  ("sauerstoff","Sauerstoff (O₂)","O=O","Grundmoleküle"),
  ("kohlendioxid","Kohlendioxid","O=C=O","Grundmoleküle"),
  ("ammoniak","Ammoniak","N","Grundmoleküle"),
  ("methan","Methan","C","Grundmoleküle"),
  ("harnstoff","Harnstoff","NC(N)=O","Grundmoleküle"),
  ("essigsaeure","Essigsäure","CC(=O)O","Säuren und Basen"),
  ("hydrogencarbonat","Hydrogencarbonat","OC(=O)[O-]","Säuren und Basen"),
  ("hydrogenphosphat","Hydrogenphosphat","OP(=O)([O-])[O-]","Säuren und Basen"),
  ("laktat","L-Milchsäure","C[C@H](O)C(=O)O","Stoffwechsel"),
  ("glukose","β-D-Glucose (Pyranoseform)","C([C@@H]1[C@H]([C@@H]([C@H]([C@@H](O1)O)O)O)O)O","Kohlenhydrate"),
  ("pyruvat","Brenztraubensäure (Pyruvat, protoniert)","CC(=O)C(=O)O","Stoffwechsel"),
  ("atp","Adenosintriphosphat (ATP, protoniert)","C1=NC(=C2C(=N1)N(C=N2)[C@H]3[C@@H]([C@@H]([C@H](O3)COP(=O)(O)OP(=O)(O)OP(=O)(O)O)O)O)N","Nukleotide"),
  ("adp","Adenosindiphosphat (ADP, protoniert)","C1=NC(=C2C(=N1)N(C=N2)[C@H]3[C@@H]([C@@H]([C@H](O3)COP(=O)(O)OP(=O)(O)O)O)O)N","Nukleotide"),
  ("amp","Adenosinmonophosphat (AMP, protoniert)","C1=NC(=C2C(=N1)N(C=N2)[C@H]3[C@@H]([C@@H]([C@H](O3)COP(=O)(O)O)O)O)N","Nukleotide"),
  ("adenin","Adenin","Nc1ncnc2[nH]cnc12","Nukleobasen"),
  ("guanin","Guanin","Nc1nc2[nH]cnc2c(=O)[nH]1","Nukleobasen"),
  ("cytosin","Cytosin","Nc1cc[nH]c(=O)n1","Nukleobasen"),
  ("thymin","Thymin","Cc1c[nH]c(=O)[nH]c1=O","Nukleobasen"),
  ("uracil","Uracil","O=c1cc[nH]c(=O)[nH]1","Nukleobasen"),
  ("glycin","Glycin","NCC(=O)O","Aminosäuren"),
  ("alanin","L-Alanin","C[C@@H](C(=O)O)N","Aminosäuren"),
  ("cystein","L-Cystein","N[C@@H](CS)C(=O)O","Aminosäuren"),
  ("tyrosin","L-Tyrosin","N[C@@H](Cc1ccc(O)cc1)C(=O)O","Aminosäuren"),
  ("lysin","L-Lysin","NCCCC[C@H](N)C(=O)O","Aminosäuren"),
  ("glutamat","L-Glutaminsäure (Glutamat, protoniert)","C(CC(=O)O)[C@@H](C(=O)O)N","Neurotransmitter"),
  ("palmitinsaeure","Palmitinsäure (C16:0)","CCCCCCCCCCCCCCCC(=O)O","Fettsäuren"),
  ("oelsaeure","Ölsäure (C18:1, cis-Δ9)","CCCCCCCC/C=C\\CCCCCCCC(=O)O","Fettsäuren"),
  ("acetylcholin","Acetylcholin","CC(=O)OCC[N+](C)(C)C","Neurotransmitter"),
  ("gaba","γ-Aminobuttersäure (GABA)","NCCCC(=O)O","Neurotransmitter"),
  ("dopamin","Dopamin","NCCc1ccc(O)c(O)c1","Neurotransmitter"),
  ("noradrenalin","(R)-Noradrenalin","NC[C@H](O)c1ccc(O)c(O)c1","Neurotransmitter"),
  ("serotonin","Serotonin","NCCc1c[nH]c2ccc(O)cc12","Neurotransmitter"),
  ("natrium","Natrium-Ion","[Na+]","Elektrolyte"),
  ("kalium","Kalium-Ion","[K+]","Elektrolyte"),
  ("calcium","Calcium-Ion","[Ca+2]","Elektrolyte"),
  ("chlorid","Chlorid-Ion","[Cl-]","Elektrolyte"),
  ("magnesium","Magnesium-Ion","[Mg+2]","Elektrolyte"),
  # Ergänzung 1. Semester: Naturstoffe, Isomerie, organische Grundstoffe
  ("glukose_alpha","α-D-Glucose (Pyranoseform)","C([C@@H]1[C@H]([C@@H]([C@H]([C@H](O1)O)O)O)O)O","Kohlenhydrate"),
  ("galaktose","β-D-Galactose (Pyranoseform)","C([C@@H]1[C@@H]([C@@H]([C@H]([C@@H](O1)O)O)O)O)O","Kohlenhydrate"),
  ("fruktose","β-D-Fructose (Furanoseform)","C([C@@H]1[C@H]([C@@H]([C@](O1)(CO)O)O)O)O","Kohlenhydrate"),
  ("ribose","β-D-Ribose (Furanoseform)","C([C@@H]1[C@H]([C@H]([C@@H](O1)O)O)O)O","Kohlenhydrate"),
  ("desoxyribose","2-Desoxy-D-ribose (offenkettig)","C(C=O)[C@@H]([C@@H](CO)O)O","Kohlenhydrate"),
  ("glycerin","Glycerin (Glycerol)","OCC(O)CO","Lipide"),
  ("tripalmitin","Tripalmitin (Triacylglycerin)","CCCCCCCCCCCCCCCC(=O)OCC(COC(=O)CCCCCCCCCCCCCCC)OC(=O)CCCCCCCCCCCCCCC","Lipide"),
  ("phosphatidylcholin","Phosphatidylcholin (Dipalmitoyl, DPPC)","CCCCCCCCCCCCCCCC(=O)OC[C@H](COP(=O)([O-])OCC[N+](C)(C)C)OC(=O)CCCCCCCCCCCCCCC","Lipide"),
  ("cholesterin","Cholesterin","C[C@H](CCCC(C)C)[C@H]1CC[C@@H]2[C@@]1(CC[C@H]3[C@H]2CC=C4[C@@]3(CC[C@@H](C4)O)C)C","Lipide"),
  ("elaidinsaeure","Elaidinsäure (C18:1, trans-Δ9)","CCCCCCCC/C=C/CCCCCCCC(=O)O","Fettsäuren"),
  ("linolsaeure","Linolsäure (C18:2, cis-Δ9,12)","CCCCC/C=C\\C/C=C\\CCCCCCCC(=O)O","Fettsäuren"),
  ("d_alanin","D-Alanin","C[C@H](C(=O)O)N","Aminosäuren"),
  ("serin","L-Serin","N[C@@H](CO)C(=O)O","Aminosäuren"),
  ("phenylalanin","L-Phenylalanin","N[C@@H](Cc1ccccc1)C(=O)O","Aminosäuren"),
  ("tryptophan","L-Tryptophan","N[C@@H](Cc1c[nH]c2ccccc12)C(=O)O","Aminosäuren"),
  ("histidin","L-Histidin","N[C@@H](Cc1c[nH]cn1)C(=O)O","Aminosäuren"),
  ("aspartat","L-Asparaginsäure (Aspartat, protoniert)","N[C@@H](CC(=O)O)C(=O)O","Aminosäuren"),
  ("glycylalanin","Glycyl-L-alanin (Dipeptid)","NCC(=O)N[C@@H](C)C(=O)O","Aminosäuren"),
  ("d_laktat","D-Milchsäure","C[C@@H](O)C(=O)O","Stoffwechsel"),
  ("citrat","Citronensäure (protoniert)","OC(=O)CC(O)(CC(=O)O)C(=O)O","Stoffwechsel"),
  ("acetoacetat","Acetessigsäure (Ketonkörper)","CC(=O)CC(=O)O","Stoffwechsel"),
  ("hydroxybutyrat","(R)-3-Hydroxybuttersäure (Ketonkörper)","C[C@@H](O)CC(=O)O","Stoffwechsel"),
  ("ethanol","Ethanol","CCO","Organische Grundstoffe"),
  ("dimethylether","Dimethylether","COC","Organische Grundstoffe"),
  ("acetaldehyd","Acetaldehyd (Ethanal)","CC=O","Organische Grundstoffe"),
  ("aceton","Aceton (Propanon)","CC(C)=O","Organische Grundstoffe"),
  ("edta","EDTA (Ethylendiamintetraessigsäure)","OC(=O)CN(CCN(CC(=O)O)CC(=O)O)CC(=O)O","Komplexbildner"),
]


# erwartete CIP-Konfigurationen (Plausibilitätsprüfung der Stereochemie)
EXPECT_CIP = {
  "glukose": sorted(["R","R","S","S","R"]),
  "alanin": ["S"], "cystein": ["R"], "tyrosin": ["S"], "lysin": ["S"], "glutamat": ["S"],
  "laktat": ["S"], "noradrenalin": ["R"],
  "atp": sorted(["R","R","S","R"]),
  "glukose_alpha": sorted(["R","S","S","R","S"]), "galaktose": sorted(["R","R","S","R","R"]),
  "fruktose": sorted(["R","S","S","R"]), "ribose": sorted(["R","R","S","R"]), "desoxyribose": sorted(["S","R"]),
  "cholesterin": sorted(["S","S","S","R","R","S","R","R"]), "phosphatidylcholin": ["R"],
  "d_alanin": ["R"], "serin": ["S"], "phenylalanin": ["S"], "tryptophan": ["S"], "histidin": ["S"], "aspartat": ["S"],
  "glycylalanin": ["S"], "d_laktat": ["R"], "hydroxybutyrat": ["R"],
}

GROUPS = [
  ("Hydroxygruppe","[CX4,c][OX2H]"),
  ("Carboxygruppe","[CX3](=O)[OX2H1,OX1-]"),
  ("Carbonylgruppe (Keton/Aldehyd)","[#6][CX3](=O)[#6,#1]"),
  ("Aminogruppe","[NX3;H2,H1;!$(NC=O);!$(N-a);!$(n)]"),
  ("Aromatische Aminogruppe","[NX3;H2][c]"),
  ("Amid/Harnstoff","[NX3][CX3]=[OX1]"),
  ("Ester","[#6][CX3](=O)[OX2][#6]"),
  ("Phosphatgruppe","P(=O)(O)O"),
  ("Phosphorsäureanhydrid","P(=O)(O)OP(=O)(O)"),
  ("Thiolgruppe","[SX2H]"),
  ("Aromatischer Ring","a1aaaaa1"),
  ("Quartäres Ammonium","[NX4+]"),
  ("C=C-Doppelbindung","[CX3]=[CX3]"),
  ("Halbacetal (glykosidisches C)","[OX2H][CX4][OX2][#6]"),
  ("Ether","[OX2;!$(OC=O);!$(OP);!$(O[CX4][OX2H])]([CX4])[CX4]"),
  ("Tertiäres Amin","[NX3;H0;!$(NC=O);!$(n)]([CX4])([CX4])[CX4]"),
  ("Aldehyd","[CX3H1](=O)[#6]"),
]

out = []
ok = True
for mid, name, smi, group in MOLS:
    mol = Chem.MolFromSmiles(smi)
    if mol is None:
        print("UNGUELTIG", mid); ok = False; continue
    Chem.SanitizeMol(mol)  # Valenzprüfung
    formula = rdMolDescriptors.CalcMolFormula(mol)
    mw = Descriptors.MolWt(mol)
    charge = Chem.GetFormalCharge(mol)
    rdCIPLabeler.AssignCIPLabels(mol)
    cip = [a.GetProp("_CIPCode") for a in mol.GetAtoms() if a.HasProp("_CIPCode")]
    if mid in EXPECT_CIP:
        got = sorted(cip) if len(EXPECT_CIP[mid])>1 else cip
        if got != EXPECT_CIP[mid]:
            print("CIP-ABWEICHUNG", mid, cip, EXPECT_CIP[mid]); ok = False
    groups = [g for g, sm in GROUPS if mol.HasSubstructMatch(Chem.MolFromSmarts(sm))]
    mh = Chem.AddHs(mol)
    if mh.GetNumAtoms() == 1:
        coords = [(0.0,0.0,0.0)]
    else:
        params = AllChem.ETKDGv3(); params.randomSeed = 42
        res = AllChem.EmbedMolecule(mh, params)
        if res != 0:  # große, flexible Moleküle: zufällige Startkoordinaten
            params.useRandomCoords = True; params.maxIterations = 5000
            res = AllChem.EmbedMolecule(mh, params)
        if res != 0:
            print("EINBETTUNG FEHLGESCHLAGEN", mid); ok = False; continue
        props = AllChem.MMFFGetMoleculeProperties(mh)
        if props is not None:
            AllChem.MMFFOptimizeMolecule(mh, maxIters=2000)
        else:
            AllChem.UFFOptimizeMolecule(mh, maxIters=2000)
        conf = mh.GetConformer()
        coords = [tuple(round(v,3) for v in conf.GetAtomPosition(i)) for i in range(mh.GetNumAtoms())]
    atoms = [{"el": a.GetSymbol(), "q": a.GetFormalCharge(), "arom": a.GetIsAromatic(), "xyz": coords[a.GetIdx()]} for a in mh.GetAtoms()]
    bonds = []
    for b in mh.GetBonds():
        bt = b.GetBondType()
        order = 1.5 if b.GetIsAromatic() else {Chem.BondType.SINGLE:1, Chem.BondType.DOUBLE:2, Chem.BondType.TRIPLE:3}.get(bt,1)
        bonds.append([b.GetBeginAtomIdx(), b.GetEndAtomIdx(), order])
    # Kekulé-Strukturformel (ohne H) als SMILES zur Anzeige
    kek = Chem.MolFromSmiles(smi); Chem.Kekulize(kek, clearAromaticFlags=True)
    out.append({"id": mid, "name": name, "group": group, "smiles": Chem.MolToSmiles(mol), "formula": formula,
                "mw": round(mw, 2), "charge": charge, "cip": cip, "functionalGroups": groups,
                "atoms": atoms, "bonds": bonds, "validation": "RDKit-Sanitisierung bestanden; Geometrie ETKDGv3 + MMFF94"})
    print(f"{mid:18s} {formula:14s} {mw:8.2f} CIP={cip} {groups}")

json.dump(out, open(sys.argv[1], "w"), ensure_ascii=False, separators=(",",":"))
print("OK" if ok else "FEHLER")

# 2D-Strukturformeln (SVG) für die Anzeige
from rdkit.Chem.Draw import rdMolDraw2D
from rdkit.Chem import rdDepictor
svgs = {}
for mid, name, smi, group in MOLS:
    m = Chem.MolFromSmiles(smi)
    rdDepictor.SetPreferCoordGen(True)
    rdDepictor.Compute2DCoords(m)
    d = rdMolDraw2D.MolDraw2DSVG(360, 260)
    o = d.drawOptions(); o.clearBackground = False; o.bondLineWidth = 2; o.addStereoAnnotation = True
    o.updateAtomPalette({6:(0.15,0.15,0.15)})
    d.DrawMolecule(m); d.FinishDrawing()
    svg = d.GetDrawingText()
    svg = svg[svg.find('<svg'):]
    svgs[mid] = svg
json.dump(svgs, open(sys.argv[1].replace('molecules.generated.json','molecules2d.generated.json'),'w'), ensure_ascii=False)
print('2D ok', len(svgs))
