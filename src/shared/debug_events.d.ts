interface CustomGameEventDeclarations {
    c2s_unit_event: {
        event: string;
        units?: EntityIndex[];
    };
    c2s_ent_move: {
        units?: EntityIndex[];
        pos: {
            x: number;
            y: number;
            z: number;
        };
    };
    c2s_console_command: {
        command: string;
    };
}
