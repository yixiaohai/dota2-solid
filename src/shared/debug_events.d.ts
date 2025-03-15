interface CustomGameEventDeclarations {
    c2s_event: {
        event: string;
    };
    c2s_unit_event: {
        event: string;
        units?: EntityIndex[];
    };
    c2s_check_event: {
        event: string;
        checked: boolean;
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

    s2c_camera_distance: {
        distance: number;
    };
    s2c_all_map_vision_state: {
        checked: boolean;
    }
}
